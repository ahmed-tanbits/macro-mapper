"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabaseClient";
import Spinner from "../components/Spinner";
import { useRouter } from "next/navigation";

// 🔹 Define Auth Context Type
type AuthContextType = {
  session: any;
  user: any;
  loading: boolean;
  authParams: any;
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  logout: () => void;
  fetchSessionAndSubscription: any;
};

// ✅ Create Auth Context
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  authParams: null,
  setSession: () => { },
  setUser: () => { },
  logout: () => { },
  fetchSessionAndSubscription: () => { }
});

// ✅ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // ✅ Default to `true` since we fetch session initially
  const router = useRouter();

  // ✅ Extract auth params from URL hash
  const authParams = useMemo(() => {
    if (typeof window === "undefined") return null;

    const hash = window.location.hash.slice(1);
    const urlParams = new URLSearchParams(hash);

    const type = urlParams.get("type");
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");
    const error = urlParams.get("error");
    const errorCode = urlParams.get("error_code");
    const errorDescription = urlParams.get("error_description");

    if (!type && !accessToken && !refreshToken && !error) return null;

    return { type, accessToken, refreshToken, error, errorCode, errorDescription };
  }, [router]);

  const fetchSessionAndSubscription = useCallback(async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (!data.session) {
        console.log("No active session found.");
        setSession(null);
        setUser(null);
        return;
      }

      const user = data.session.user;

      // ✅ Fetch Subscription
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (subError && subError.code !== "PGRST116") {
        console.error("Subscription fetch error:", subError.message);
      }

      // ✅ Ensure hasSubscription is TRUE until the grace period expires
      const isActive = subData && ["active", "complete"].includes(subData.status);
      const isGracePeriod = subData && subData.status === "cancel_at_period_end" && subData.cancel_at * 1000 > Date.now();
      const hasCanceledSubscription = subData?.status === "cancel_at_period_end"; // ✅ New key to track cancellation

      console.log("Status:", subData?.status);
      console.log("Cancel At (Seconds from DB):", subData?.cancel_at);
      console.log("Cancel At (Milliseconds):", subData?.cancel_at * 1000);
      console.log("Current Time (Milliseconds):", Date.now());
      console.log("Condition Result:", subData?.cancel_at * 1000 > Date.now());

      console.log("Grace Period =>", isGracePeriod);

      console.log("hasCanceledSubscription =>", hasCanceledSubscription)

      setSession(data.session);
      setUser({
        ...user,
        subscription: subData || null,
        hasSubscription: isActive || isGracePeriod, // ✅ Keeps subscription valid during grace period
        hasCanceledSubscription
      });
    } catch (err) {
      console.error("Error in fetchSessionAndSubscription:", err);
    } finally {
      setLoading(false); // ✅ Always ensure loading is false
    }
  }, []);

  useEffect(() => {
    fetchSessionAndSubscription(); // ✅ Fetch session ONCE on mount
  }, []); // ✅ Removed `[session]` to avoid infinite re-renders

  // ✅ Logout function
  const logout = async (shouldRedirect: boolean = true) => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);

    // ✅ Clear Supabase session storage
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      localStorage.removeItem("sb-wsuteglijvwrmcsjhhom-auth-token");
      sessionStorage.removeItem("sb-wsuteglijvwrmcsjhhom-auth-token");
    }
    if (shouldRedirect) {
      router.replace("/");
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, authParams, setSession, setUser, logout, fetchSessionAndSubscription }}>
      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          <Spinner width={50} height={50} color="primary" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => useContext(AuthContext);
