import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia" as any, // Ignore strict typing to prevent errors
} as Stripe.StripeConfig);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json(); // Get user ID from request body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 🔹 Fetch user's active subscription from Supabase
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "complete") // ✅ Ensure subscription is still active
      .single();

    if (subError || !subscription) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    // 🔹 Cancel the subscription at the end of billing period
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: true } // ✅ Set to cancel at end of billing period
    );

    // 🔹 Update subscription status in Supabase
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "cancel_at_period_end", // ✅ Better status tracking
        cancel_at: canceledSubscription.current_period_end, // Store expiry date
      })
      .eq("id", subscription.id);
    if (updateError) {
      return NextResponse.json({ error: "Failed to update subscription in Supabase" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription will remain active until the end of the billing period.",
      cancel_at: canceledSubscription.current_period_end,
    });

  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
