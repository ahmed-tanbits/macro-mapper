"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import Spinner from "../components/Spinner";

// 🔹 Define Auth Context Type
type AuthContextType = {
  session: any;
  user: any;
  loading: boolean;
  setSession: (session: any) => void;
  logout: () => void;
};

// ✅ Create Auth Context
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true, // ✅ Default to loading
  setSession: () => { },
  logout: () => { },
});

// ✅ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // ✅ Track loading state

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
    <AuthContext.Provider value={{ session, user, loading, setSession, logout }}>
      {loading ? <div className="min-h-screen flex justify-center items-center"><Spinner width={50} height={50} color="primary" /></div> : children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => useContext(AuthContext);
