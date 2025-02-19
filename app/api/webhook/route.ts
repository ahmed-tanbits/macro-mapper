import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/supabaseClient";

// Initialize Stripe with secret key
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY as string,
  {
    apiVersion: "2025-01-27.acacia" as any, // Ignore strict typing to prevent errors
  } as Stripe.StripeConfig
);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  let event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("✅ Checkout Session Completed:", JSON.stringify(session));

    const email = session.customer_details?.email as string;
    const user_id = session.metadata?.user_id;
    const plan = session.metadata?.plan as string;
    const plan_id = session.metadata?.plan_id as string;
    const stripe_user_id = session.customer as string;
    const subscriptionId = session.subscription as string;
    const amountTotal = session.amount_total || 0;
    const currency = session.currency || "usd";
    const payment_status = session.payment_status;
    const status = session.status;

    if (!user_id || !subscriptionId) {
      console.error("❌ Missing user_id or subscriptionId.");
      return NextResponse.json(
        { error: "Invalid request: Missing required data" },
        { status: 400 }
      );
    }

    // 🔍 Check if the user already has a subscription in Supabase
    const { data: existingSubscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("id, stripe_subscription_id, status")
      .eq("user_id", user_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("❌ Error checking existing subscription:", fetchError.message);
      return NextResponse.json(
        { error: "Failed to check existing subscription" },
        { status: 500 }
      );
    }

    let subscriptionIdToUse = subscriptionId;

    if (existingSubscription) {
      if (existingSubscription.stripe_subscription_id !== subscriptionId) {
        // 🔄 Update subscription if the ID has changed (e.g., user re-subscribed)
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            stripe_subscription_id: subscriptionId,
            status,
            stripe_user_id,
            plan,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSubscription.id);

        if (updateError) {
          console.error("❌ Error updating subscription:", updateError.message);
          return NextResponse.json(
            { error: "Failed to update subscription" },
            { status: 500 }
          );
        }

        console.log("🔄 Subscription updated successfully");
        subscriptionIdToUse = existingSubscription.id;
      }
    } else {
      // ➕ Insert new subscription if the user does not have one
      const { data: newSubscription, error: insertError } = await supabase
        .from("subscriptions")
        .insert([
          {
            email,
            stripe_subscription_id: subscriptionId,
            status,
            stripe_user_id,
            created_at: new Date().toISOString(),
            user_id,
            plan,
          },
        ])
        .select("id")
        .single();

      if (insertError) {
        console.error("❌ Error inserting subscription:", insertError.message);
        return NextResponse.json(
          { error: "Failed to store subscription" },
          { status: 500 }
        );
      }

      console.log("✅ New subscription inserted");
      subscriptionIdToUse = newSubscription.id;
    }

    // 🏦 Store transaction (since a user can have multiple payments for the same subscription)
    const { error: transError } = await supabase.from("transactions").insert([
      {
        subscription_id: subscriptionIdToUse,
        amount: amountTotal,
        currency,
        status: payment_status,
        created_at: new Date().toISOString(),
      },
    ]);

    if (transError) {
      console.error("❌ Error inserting transaction:", transError.message);
      return NextResponse.json(
        { error: "Failed to store transaction" },
        { status: 500 }
      );
    }

    console.log("✅ Subscription and Transaction stored successfully");
  }

  return NextResponse.json({ received: true });
}
