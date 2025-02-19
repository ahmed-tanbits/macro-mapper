'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const stripe = await stripePromise;

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });

    const { sessionId } = await response.json();

    if (sessionId) {
      const { error } = await stripe!.redirectToCheckout({ sessionId });
      if (error) console.error(error);
    }

    setLoading(false);
  };

  return (
    <button 
      onClick={handleClick} 
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {loading ? 'Processing...' : 'Subscribe'}
    </button>
  );
}
