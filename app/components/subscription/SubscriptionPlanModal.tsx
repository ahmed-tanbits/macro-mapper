import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { loadStripe } from '@stripe/stripe-js';
import Spinner from "../Spinner";
import { RadioGroup, RadioGroupItem } from "../RadioGroup";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "@/app/hooks/useToast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const plans = [
  {
    id: "plan1",
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || "",
    name: "Monthly",
    price: "$3.49",
  },
  {
    id: "plan2",
    priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || "",
    name: "Yearly",
    price: "$29.99",
  },
];

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
    label: "Support MacroMapper's Vision",
    para: "Macromapper is determined to be the leading food finding platform, showcasing thousands of restaurants and products. Join us on our journey and help us expand!",
  },
];

interface SubscriptionPlanModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SubscriptionPlanModal({ open, setOpen }: SubscriptionPlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]?.priceId);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleUpgradePlan = async () => {
    if (!user) {
      toast({
        title: "Error!",
        description: "You must be logged in to access premium features.",
        variant: "destructive", // Red error toast
      });
      return;
    }
    setLoading(true);

    const stripe = await stripePromise;

    const currentPlan = plans.find((plan) => plan.priceId === selectedPlan)

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: currentPlan, userId: user?.id }),
    });

    const { sessionId } = await response.json();

    if (sessionId) {
      const { error } = await stripe!.redirectToCheckout({ sessionId });
      if (error) console.error(error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90%] max-w-md p-6 rounded-lg shadow-lg sm:w-full">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-lg font-semibold">Go Premium</DialogTitle>
        </div>
        {/* <p className="text-sm text-gray-500">Subscribe to MacroMapper Premium</p> */}

        <ul className="w-full flex flex-col bg-white rounded-xl gap-4 mt-1">
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
                <p className="text-xs text-[#6C6C6C] font-normal pl-0.5">{value.para}</p>
              </div>
            </li>
          ))}
        </ul>

        <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-3 mt-2">
          {plans.map((plan) => (
            <Label
              key={plan.id}
              htmlFor={plan.id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${selectedPlan === plan.priceId ? "border-primary-600 bg-green-50" : "border-gray-300"
                }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem id={plan.id} value={plan.priceId}
                  className="data-[state=checked]:border-primary-600 fill-primary-600"

                />
                <div>
                  <p className="font-medium">{plan.name}</p>
                  {/* <p className="text-xs text-gray-500">{plan.description}</p> */}
                </div>
              </div>
              <p className="font-semibold">{plan.price} <span className="text-xs text-gray-500">/ {plan.name === "Yearly" ? "year" : "month"}</span></p>
            </Label>
          ))}
        </RadioGroup>

        <Button className="w-full mt-2 bg-primary-600 hover:bg-primary-700" onClick={handleUpgradePlan}>
          {loading ?
            <Spinner />
            : "Upgrade Now"
          }
        </Button>
      </DialogContent>
    </Dialog>
  );
}
