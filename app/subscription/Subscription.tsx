"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { loadStripe } from "@stripe/stripe-js";
import Banner from "../auth/Banner";
import Image from "next/image";
import Spinner from "../components/Spinner";
import CancelSubscriptionModal from "./components/CancelSubscriptionModal";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const plans = [
  {
    id: "plan1",
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || "",
    name: "Monthly",
    price: "3.49 AUD",
  },
  {
    id: "plan2",
    priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || "",
    name: "Yearly",
    price: "29.99 AUD",
  },
];

const Subscription: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<any>({
    plan1: false,
    plan2: false,
    subscription: false,
  });

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const { user, setUser } = useAuth();

  const { toast } = useToast();

  const handleUpgradePlan = async (plan: any) => {
    setLoading({ ...loading, [plan.id]: true });

    const stripe = await stripePromise;

    try {
      const response: any = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId: user?.id }),
      });
      console.log(response, "responce");

      const { sessionId } = await response.json();
      if (sessionId) {
        const { error } = await stripe!.redirectToCheckout({ sessionId });
        if (error) console.error(error);
      }
      if (response.message) {
        toast({
          title: "Success!",
          description: response.message,
          variant: "success",
        });
      } else if (response.error) {
        toast({
          title: "Error!",
          description: response.error,
          variant: "destructive",
        });
      }

      router.push("/auth/welcome-to-premium");
    } catch (error) {
      console.error("Subscription error:", error);
    }
    setLoading({ ...loading, [plan.id]: false });
  };

  const handleCancelSubscription = async () => {
    if (!user) {
      toast({
        title: "Error!",
        description: "You need to be logged in!",
        variant: "destructive",
      });
      return;
    }

    setLoading({ ...loading, subscription: true });
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }), // Pass user's ID
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Subscription canceled successfully!",
          variant: "success",
        });
        // 🔹 Update local state (if needed)
        setUser((prevUser: any) => ({
          ...prevUser,
          subscription: { ...prevUser.subscription, status: "canceled" },
          hasSubscription: false, // Update flag
        }));
      } else {
        toast({
          title: "Error!",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Cancel Subscription Error:", error);
      toast({
        title: "Error!",
        description: "Failed to cancel subscription.",
        variant: "destructive",
      });
    } finally {
      setLoading({ ...loading, subscription: false });
    }
  };

  const cardContent = [
    {
      label: "Filter by Macronutrients",
      para: "Find more meals that meet your requirements with protein, carbohydrates and fat filters.",
    },
    {
      label: "Filter for Dietary Restrictions",
      para: "Filter by 10 types of dietary restrictions, including gluten-free, vegetarian, nut-free and more.",
    },
    {
      label: "Support MacroMapper’s Vision",
      para: "Macromapper is determined to be the leading food finding platform, showcasing thousands of restaurants and products. Join us on our journey and help us expand!",
    },
  ];

  return (
    <section className="grid grid-cols-12">
      <div className="col-span-12 sm:col-span-6 md:col-span-5 w-full p-4 lg:p-16 bg-[#09BE06] sm:bg-white h-screen overflow-y-auto">
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-[#2E3139] text-2xl md:text-3xl font-bold pb-3">
            My Subscription
          </h2>
          <p className="text-[#425583] text-sm font-normal">
            Subscribe to MacroMapper Premium
          </p>
          <ul className="w-full flex flex-col bg-white rounded-xl gap-4 mt-2">
            {cardContent.map((value, index) => (
              <li key={index} className="flex items-start flex-col gap-1">
                <span className="flex gap-2 w-full">
                  <Image
                    src="/check-mark.png"
                    alt="check-icon"
                    layout="intrinsic"
                    width={18}
                    height={18}
                    className="flex-shrink-0 object-contain"
                  />
                  <p className="text-sm text-[#2E3139] font-bold">
                    {value.label}
                  </p>
                </span>
                <div className="ml-6">
                  <p className="text-xs text-[#6C6C6C] font-normal pl-0.5">
                    {value.para}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 mt-4">
            {plans.map((plan) => (
              <div
                key={plan.price}
                className="flex flex-col items-center w-full gap-2"
              >
                <label className="text-[#2E3139] text-sm font-bold">
                  {plan.name}
                </label>
                <button
                  type="button"
                  onClick={() => handleUpgradePlan(plan)}
                  className="w-full py-3 cursor-pointer rounded-full font-medium text-sm transition bg-primary-600 hover:bg-primary-700 text-white"
                  disabled={
                    loading[plan.id] ||
                    (user?.hasSubscription &&
                      user?.subscription?.plan === plan.name)
                  }
                >
                  {loading[plan.id] ? (
                    <Spinner />
                  ) : user?.hasSubscription &&
                    user?.subscription?.plan === plan.name ? (
                    "Current Plan"
                  ) : (
                    `${plan.price} /${plan.name}`
                  )}
                </button>
              </div>
            ))}
          </div>
          {user?.hasSubscription && (
            <div className="mt-6">
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <p className="px-4 text-[#425583] text-sm font-normal">
                  Your Subscription
                </p>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full py-3 rounded-full font-medium text-sm transition bg-danger-500 hover:bg-red-700 text-white"
              >
                {loading.subscription ? <Spinner /> : "Cancel Subscription"}
              </button>
            </div>
          )}
          <CancelSubscriptionModal
            open={isCancelModalOpen}
            setOpen={setIsCancelModalOpen}
            handleCancelSubscription={handleCancelSubscription}
          />
        </div>
      </div>
      <Banner />
    </section>
  );
};

export default Subscription;
