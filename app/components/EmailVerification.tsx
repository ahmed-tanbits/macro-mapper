"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
// Function to extract params from hash (`#`)
const getHashParams = () => {
  if (typeof window === "undefined") return {}; // Prevent SSR issues

  const hash = window.location.hash.substring(1); // Remove `#`
  const params = new URLSearchParams(hash);
  
  return {
    token: params.get("token"),
    error: params.get("error"),
    errorCode: params.get("error_code"),
    errorMessage: params.get("error_description"),
  };
};

export default function EmailVerificationHandler() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const { token, error, errorCode, errorMessage } = getHashParams();

    if (error && errorCode === "otp_expired") {
      setMessage(errorMessage || "Your email verification link has expired. Please request a new one.");
      return;
    }

    if (token) {
      supabase.auth.exchangeCodeForSession(token).then(({ data, error }) => {
        if (error) {
          setMessage("Error confirming email: " + error.message);
          return;
        }

        setMessage("Email confirmed successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      });
    }
  }, [router]);

  if (!message) return null; // Don't render anything if no message

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-100 text-black px-4 py-2 rounded-lg shadow-lg z-50">
      {message}
    </div>
  );
}
