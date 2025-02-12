"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Create Auth Context
const AuthContext = createContext({
  token: null as string | null,
  setToken: (token: string | null) => {},
  removeToken: () => {},
});

// Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);

  // Load token from localStorage when app initializes
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  // Function to update the token and trigger immediate re-render
  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    setTokenState(newToken); // ✅ Trigger re-render immediately
  };

  // Function to remove the token
  const removeToken = () => {
    localStorage.removeItem("token");
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth Context
export const useAuth = () => useContext(AuthContext);
