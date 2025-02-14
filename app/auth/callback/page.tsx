"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
import ResendConfirmationEmail from "@/app/components/ResendConfirmationEmail";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorMessage = searchParams.get("error_description");

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error && errorCode === "otp_expired") {
      setMessage("Your email verification link has expired. Please resend the confirmation email.");
      return;
    }

    if (token) {
      supabase.auth.exchangeCodeForSession(token).then(({ data, error }) => {
        if (error) {
          setMessage("Error confirming email: " + error.message);
          return;
        }

        setMessage("Email confirmed successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      });
    }
  }, [token, error, errorCode, router]);

  return (
    <div>
      <h2>Email Verification</h2>
      {message ? <p>{message}</p> : <p>Verifying your email...</p>}
      {error && errorCode === "otp_expired" && (
        <ResendConfirmationEmail />
      )}
    </div>
  );
}
