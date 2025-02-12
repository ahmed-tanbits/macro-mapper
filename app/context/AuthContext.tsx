"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

type AuthContextType = {
  session: any;
  token: string | null;
  setToken: (token: string | null) => void;
  removeToken: () => void;
};

// ✅ Create Auth Context
const AuthContext = createContext<AuthContextType>({
  session: null,
  token: null,
  setToken: () => {},
  removeToken: () => {},
});

// ✅ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [token, setTokenState] = useState<string | null>(
    () => localStorage.getItem("token") // ✅ Load token from storage
  );

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session Error:", error);
        removeToken();
      } else if (data.session) {
        setSession(data.session);
        setTokenState(data.session.access_token);
        localStorage.setItem("token", data.session.access_token);
      }
    };

    fetchSession();

    // ✅ Listen for auth state changes (auto-refresh token)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setSession(session);
          setTokenState(session.access_token);
          localStorage.setItem("token", session.access_token);
        } else {
          removeToken();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Update Token
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setTokenState(newToken);
  };

  // ✅ Remove Token
  const removeToken = () => {
    localStorage.removeItem("token");
    setSession(null);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ session, token, setToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => useContext(AuthContext);
