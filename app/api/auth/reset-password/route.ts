// import { NextResponse } from "next/server";
// import { supabase } from "@/supabaseClient";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// // Secret key for JWT
// const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

// export async function POST(req: Request) {
//   try {
//     const { token, newPassword } = await req.json();

//     // Validate input
//     if (!token || !newPassword) {
//       return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
//     }

//     // Verify JWT Token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, JWT_SECRET);
//     } catch (err) {
//       return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//     }

//     const userId = decoded.userId;

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update user password in Supabase
//     const { error } = await supabase.auth.updateUser({
//       password: hashedPassword,
//     });

//     if (error) {
//       return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
//     }

//     return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { supabase } from "@/supabaseClient";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Secret key for JWT (ensure this is set correctly in environment variables)
const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    // Validate input
    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    // Verify JWT Token and extract payload
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = decoded.userId as string;
    
    // **Use Supabase’s built-in password update method**
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Supabase update error:", error.message);
      return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
    }

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
