"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

type AuthContextType = {
  session: any;
  setSession: any
};

// ✅ Create Auth Context
const AuthContext = createContext<AuthContextType>({
  session: null,
  setSession: () => {},
});

// ✅ Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session Error:", error);
      } else if (data.session) {
        setSession(data.session);
      }
    };

    fetchSession();

    // ✅ Listen for auth state changes (auto-refresh token)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setSession(session);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => useContext(AuthContext);
