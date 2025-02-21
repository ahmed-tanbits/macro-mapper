"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";

export default function SuccessPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying subscription...");
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (sessionId) {
      setMessage("🎉 Subscription successful! Redirecting...");
    } else {
      setMessage("⚠️ No session found. Redirecting to home...");
    }

    const countdownInterval = setInterval(() => {
      setRedirectCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => router.push("/auth/welcome-to-premium"), 3000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-center">
        <Spinner /> {/* Custom Spinner */}
        <h1 className="text-xl font-semibold text-gray-800">{message}</h1>
        <p className="text-gray-600 mt-2">Redirecting in {redirectCountdown}...</p>
      </div>
    </div>
  );
}
