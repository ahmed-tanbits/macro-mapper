"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/app/hooks/useToast";
import { loadStripe } from "@stripe/stripe-js";
import Banner from "../auth/Banner";
import Image from "next/image";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const plans = [
  {
    id: "price_1Qs0NAGT7SStcoR0t8M1TaSg",
    name: "Monthly",

    price: "$3.49",
  },
  {
    id: "price_1Qs0O6GT7SStcoR0T3ZwHCtD",
    name: "Yearly",

    price: "$20.99",
  },
];

const Subscription: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session, user } = useAuth();
  const { toast } = useToast();

  console.log("user =>", user);

  const handleUpgradePlan = async (priceId: string) => {
    setLoading(true);
    setSelectedPlan(priceId);

    const stripe = await stripePromise;
    try {
      const response: any = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
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

      //   router.push("/");
    } catch (error) {
      console.error("Subscription error:", error);
    }
    setLoading(false);
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
                key={plan.id}
                className="flex flex-col items-center w-full gap-2"
              >
                <label className="text-[#2E3139] text-sm font-bold">
                  {plan.name}
                </label>
                <button
                  type="button"
                  onClick={() => handleUpgradePlan(plan.id)}
                  className="w-full py-3 rounded-full font-medium text-sm transition bg-[#08C600] text-white"
                  disabled={loading}
                >
                  {selectedPlan === plan.id
                    ? "Current Plan"
                    : `${plan.price} ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          {selectedPlan && (
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
                onClick={() => setSelectedPlan(null)}
                className="w-full py-3 rounded-full font-medium text-sm transition bg-[#940000] text-white"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>
      </div>
      <Banner />
    </section>
  );
};

export default Subscription;
