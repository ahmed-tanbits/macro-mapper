"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Authentication() {
  const router = useRouter();
  const [message, setMessage] = useState("Loading...");
  const { authParams, user, logout } = useAuth();

  useEffect(() => {

    if (!authParams) {
      // ❌ If no authParams, user didn't come from email → Redirect back
      router.push("/");
      return;
    }

    const { type, accessToken, refreshToken, error, errorDescription } = authParams;

    if (error) {
      setMessage(`⚠️ Error: ${errorDescription || "Something went wrong."}`);
      return;
    }

    switch (type) {
      case "signup":
        setMessage("🎉 Email verified! You can now log in.");

        // Log out the user if they are logged in
        logout(false);

        // Wait a moment before redirecting
        setTimeout(() => {
          router.push("/auth/upgrade-to-premium"); // Redirect to login
        }, 3000); // 3-second delay for the user to read the message
        break;

      case "recovery":
        setMessage("🔑 Password reset link verified. Redirecting...");
        // Log out the user if they are logged in

        // ✅ Store a temporary flag in session storage
        sessionStorage.setItem("passwordResetAllowed", "true");

        router.push("/auth/reset-password");
        break;

      case "magiclink":
        if (accessToken && refreshToken) {
          supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          setMessage("✨ Magic link verified! You're logged in.");
        }
        break;
      default:
        setMessage("✅ Authentication successful!");
    }
  }, [authParams]);

  return (
    <div className="flex flex-col items-center justify-start mt-12 min-h-screen">
  {authParams ? (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold text-center mb-4">{message}</h1>
    </div>
  ) : (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold text-center mb-4">Loading...</h1>
    </div>
  )}
</div>
  );
}
