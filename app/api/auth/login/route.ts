import { NextResponse } from "next/server";
import { supabase } from "@/supabaseClient";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Secret key for JWT
const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Fetch user from Supabase
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.user.id, email: user.user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return NextResponse.json({ message: "Login successful", token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
