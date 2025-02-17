"use client";
import { useState } from "react";
import { supabase } from "@/supabaseClient";

export default function ResendConfirmationEmail() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false }, // Prevents accidental new account creation
    });

    if (error) {
      setMessage("Error resending email: " + error.message);
    } else {
      setMessage("A new confirmation email has been sent. Please check your inbox.");
    }
  };

  return (
    <div>
      <h3>Resend Confirmation Email</h3>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleResend}>Resend Email</button>
      {message && <p>{message}</p>}
    </div>
  );
}
