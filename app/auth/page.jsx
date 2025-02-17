"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";

export default function Authentication() {
  const router = useRouter();
  const [message, setMessage] = useState("Processing authentication...");
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const processAuth = async () => {
      if (typeof window === "undefined") return;

      const hash = window.location.hash.slice(1); // Remove the "#"
      const urlParams = new URLSearchParams(hash);
      const paramsObj = Object.fromEntries(urlParams.entries());

      const { type, access_token, refresh_token, error, error_description } = paramsObj;

      // Handle Errors
      if (error) {
        setMessage(`⚠️ ${error_description || "Authentication failed. Please try again."}`);
        setShowLoginButton(false);
        return;
      }

      // Case: Signup (Only if token exists)
      if (type === "signup") {
        setMessage("🎉 Congratulations! Your email has been successfully verified! You can now log in.");
        setShowLoginButton(true);
      } 
      // Case: Password Recovery
      else if (type === "recovery") {
        router.push("/auth/new-password");
      } 
      // Case: Magic Link authentication
      else if (type === "magiclink") {
        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            setMessage("⚠️ Oops! The link has expired or is invalid. Please try requesting a new one.");
            setShowLoginButton(false);
          } else {
            setSession(data.session);
            setMessage("🎉 You're all set! Authentication was successful. Click below to proceed.");
            setShowLoginButton(true);
          }
        } else {
          setMessage("⚠️ Oops! The link has expired or is invalid. Please try requesting a new one.");
          setShowLoginButton(false);
        }
      } 
      // Default error message
      else {
        setMessage("❌ Invalid authentication request. Please check the link and try again.");
        setShowLoginButton(false);
      }
    };

    processAuth();
  }, [router]);

  // Handle Login Button Click
  const handleLogin = async () => {
    if (session) {
      router.push("/"); // Redirect user to home if session exists
    } else {
      router.push("/auth/login"); // Redirect to login if session is not set
    }
  };

  return (
    <div className="flex flex-col items-center justify-start mt-12 min-h-screen">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-center mb-4">{message}</h1>

        {showLoginButton && (
          <button
            onClick={handleLogin}
            className="w-full bg-[#08C600] text-[#FFFFFF] py-3 rounded-full font-medium text-sm hover:bg-green-600 transition mx-auto"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}
