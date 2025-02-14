import CheckoutButton from "./CheckoutButton";

export default function SubscriptionModal() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Choose Your Subscription Plan</h1>

      <div className="border p-4 mb-4">
        <h2 className="text-xl">Monthly Plan - $3.49</h2>
        <CheckoutButton priceId="price_1QsHHdEPRR9CWPew0qlelHSq" />
      </div>

      <div className="border p-4">
        <h2 className="text-xl">Yearly Plan - $20.99</h2>
        <CheckoutButton priceId="price_1QsHIMEPRR9CWPewe0tnihZb" />
      </div>
    </div>
  );
}
