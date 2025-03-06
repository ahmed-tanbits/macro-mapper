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
};

// ✅ Create Auth Context
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  authParams: null,
  setSession: () => {},
  setUser: () => {},
  logout: () => {},
});

// ✅ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false); // ✅ Default to `true` since we fetch session initially
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

  // ✅ Fetch session and subscription
  const fetchSessionAndSubscription = useCallback(async () => {
    let isMounted = true; // ✅ Prevent state updates on unmounted component
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.getSession();

      console.log(data,"dataa")

      if (error) throw error;

      if (!data.session) {
        
        if (isMounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
        return;
      }
 
      const user = data.session.user;

      // ✅ Fetch subscription (avoid unnecessary calls if already exists)
      let subscription = null;
      let hasSubscription = false;

      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (subError && subError.code !== "PGRST116") {
        console.error("Error fetching subscription:", subError.message);
      } else {
        subscription = subData;
        hasSubscription = subscription ? ["active", "complete"].includes(subscription.status) : false;
      }

      if (isMounted) {
        setSession(data.session);
        setUser({
          ...user,
          subscription: subscription || null,
          hasSubscription,
        });
        setLoading(false);
      }
    } catch (err) {
      console.error("Error in fetchSessionAndSubscription:", err);
      if (isMounted) setLoading(false);
    }
    finally{
      setLoading(false);
    }

    return () => {
      isMounted = false; // ✅ Prevent state updates
    };
  }, []);

  useEffect(() => {
    fetchSessionAndSubscription();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          setSession(null);
          setUser(null);
          return;
        }

        // ✅ Only update user if it's different
        if (session.user.id !== user?.id) {
          try {
            const { data: subscription } = await supabase
              .from("subscriptions")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            setSession(session);
            setUser({
              ...session.user,
              subscription,
              hasSubscription: subscription ? ["active", "complete"].includes(subscription.status) : false,
            });
          } catch (authChangeError) {
            console.error("Error in auth state change handler:", authChangeError);
          }
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchSessionAndSubscription, user?.id]); // ✅ Add `user?.id` to dependencies

  // ✅ Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);

    // ✅ Clear Supabase session storage
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      localStorage.removeItem("sb-wsuteglijvwrmcsjhhom-auth-token");
      sessionStorage.removeItem("sb-wsuteglijvwrmcsjhhom-auth-token");
    }
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, authParams, setSession, setUser, logout }}>
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
