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
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("✅ Subscription Created:", JSON.stringify(session));
    // Store subscription in your database here

    const email = session.customer_details?.email as string;
    const user_id = session.metadata?.user_id;
    const stripe_user_id = session.customer as string;
    const subscriptionId = session.subscription as string;
    const amountTotal = session.amount_total || 0;
    const currency = session.currency || "usd";
    const payment_status = session.payment_status;
    const status = session.status;
    console.log("session =>", session);
    // Store subscription in Supabase
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .insert([
        {
          email,
          stripe_subscription_id: subscriptionId,
          status,
          stripe_user_id,
          created_at: new Date().toISOString(),
          user_id,
        },
      ])
      .select("id")
      .single();

    if (subError) {
      console.error("Error inserting subscription:", subError.message);
      return NextResponse.json(
        { error: "Failed to store subscription" },
        { status: 500 }
      );
    }

    // Store transaction in Supabase
    const { error: transError } = await supabase.from("transactions").insert([
      {
        subscription_id: subscription.id,
        amount: amountTotal,
        currency,
        status: payment_status,
      },
    ]);

    if (transError) {
      console.error("Error inserting transaction:", transError.message);
      return NextResponse.json(
        { error: "Failed to store transaction" },
        { status: 500 }
      );
    }

    console.log("✅ Subscription and Transaction stored successfully");
  }

  return NextResponse.json({ received: true });
}
