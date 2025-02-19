import { NextResponse } from "next/server";
import { supabase } from "@/supabaseClient";

export async function POST(req: Request) {
  try {
    // ✅ Get Token from Headers
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized. No token provided." }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // ✅ Fetch user from Supabase using token
    const { data: user, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user || !user.user) {
      console.error("User Fetch Error:", userError);
      return NextResponse.json({ error: "User not found or unauthorized" }, { status: 404 });
    }

    const userId = user.user.id;

    const { fullName, email, password } = await req.json();

    // ✅ Update Email or Password in Supabase Auth
    if (email || password) {
      const { error: updateAuthError } = await supabase.auth.updateUser({
        email,
        password,
      });

      if (updateAuthError) {
        console.error("Auth Update Error:", updateAuthError);
        return NextResponse.json({ error: updateAuthError.message }, { status: 400 });
      }
    }

    // ✅ Update Full Name in Supabase Database (Optional)
    if (fullName) {
      const { error: updateError } = await supabase
        .from("users") // Ensure "users" is your correct table name
        .update({ full_name: fullName })
        .eq("id", userId);

      if (updateError) {
        console.error("Database Update Error:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
