"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
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
  logout: () => void;
};

// ✅ Create Auth Context
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true, // ✅ Default to loading
  authParams: null,
  setSession: () => { },
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


  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true); // Start loading
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session Error:", error);
      } else if (data.session) {
        setSession(data.session);
        setUser(data.session.user); // ✅ Store user info
      }

      setLoading(false); // Stop loading
    };

    fetchSession();

    // ✅ Listen for auth state changes (auto-refresh token)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true); // Start loading when auth state changes

        if (session) {
          setSession(session);
          setUser(session.user); // ✅ Update user info
        } else {
          setSession(null);
          setUser(null);
        }

        setLoading(false); // Stop loading
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, authParams, setSession, logout }}>
      {loading ? <div className="min-h-screen flex justify-center items-center"><Spinner width={50} height={50} color="primary" /></div> : children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => useContext(AuthContext);
