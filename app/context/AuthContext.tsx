"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabaseClient";
import Spinner from "../components/Spinner";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

// 🔹 Define Auth Context Type
type AuthContextType = {
  session: any;
  user: any;
  loading: boolean;
  authParams: any;
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  logout: () => void;
};

// ✅ Create Auth Context
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true, // ✅ Default to loading
  authParams: null,
  setSession: () => { },
  setUser: () => { },
  logout: () => { },
});

// ✅ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // ✅ Track loading state
  const router = useRouter();

  const authParams = useMemo(() => {
    if (typeof window === "undefined") return null;

    const hash = window.location.hash.slice(1); // Remove `#`
    const urlParams = new URLSearchParams(hash);

    // ✅ Extract values
    const type = urlParams.get("type");
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");
    const error = urlParams.get("error");
    const errorCode = urlParams.get("error_code");
    const errorDescription = urlParams.get("error_description");

    // ✅ Return null if no useful params exist
    if (!type && !accessToken && !refreshToken && !error) return null;

    return { type, accessToken, refreshToken, error, errorCode, errorDescription };
  }, [router]);

  const fetchSessionAndSubscription = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Session Error:", error);
      setLoading(false);
      return;
    }

    if (data.session) {
      const user = data.session.user;

      const { data: subscription, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (subError && subError.code !== "PGRST116") {
        console.error("Error fetching subscription:", subError.message);
      }

      const hasSubscription = subscription
        ? ["active", "complete"].includes(subscription.status)
        : false;

      setSession(data.session);
      setUser({ ...user, subscription: subscription || null, hasSubscription });
    } else {
      setSession(null);
      setUser(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSessionAndSubscription();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user.id !== user?.id) {
          const { data: subscription } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          setSession(session);
          setUser((prevUser: any) => ({
            ...session.user,
            subscription,
            hasSubscription: subscription ? ["active", "complete"].includes(subscription.status) : false,
          }));
        } else {
          setSession(null);
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchSessionAndSubscription]);

  // ✅ Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);

    // Ensure Supabase session storage is cleared
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      localStorage.removeItem("sb-wsuteglijvwrmcsjhhom-auth-token");
      sessionStorage.removeItem("sb-wsuteglijvwrmcsjhhom-auth-token");
    }
    router.replace("/")
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, authParams, setSession, setUser, logout }}>
      {loading ? <div className="min-h-screen flex justify-center items-center"><Spinner width={50} height={50} color="primary" /></div> : children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => useContext(AuthContext);
