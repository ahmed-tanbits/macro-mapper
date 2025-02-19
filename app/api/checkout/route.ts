import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-01-27.acacia' as any, // Ignore strict typing to prevent errors
} as Stripe.StripeConfig);

export async function POST(req: NextRequest) {
    try {
        const { plan, userId } = await req.json();

        if (!plan.priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: plan?.priceId, // Stripe Price ID for subscription
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL,
            metadata: {
                user_id: userId,
                plan: plan.name,
                plan_id: plan.priceId
            }
        });

        return NextResponse.json({ sessionId: session.id }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
