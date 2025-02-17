import { NextResponse } from "next/server";
import { supabase } from "@/supabaseClient";
import bcrypt from "bcryptjs";

// Handle POST request for signup
export async function POST(req: Request) {
  try {
    const { email, password, confirmPassword, fullName } = await req.json();

    // Validate input
    if (!email || !password || !confirmPassword || !fullName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
      options: {
        data: { fullName },
        emailRedirectTo: `${process.env.NEXT_FRONTEND_URL}/auth`
      },
    },
    );

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ message: "Signup successful! Check your email to verify." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
