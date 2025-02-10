import React from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import Link from "next/link";

function SubscriptionBanner() {
  const cardContent = [
    "Unlock Macronutrient Results",
    "Unlock Advanced Search",
    "Unlock Allergy Results",
  ];

  return (
    <section className="bg-[linear-gradient(to_top,#007A17,#00CF3A)] mt-16 w-full lg:mt-32">
      <div className="max-w-screen-xl mx-auto px-4 py-6 relative flex items-center gap-6">
        <div className="w-full 992:max-w-[500px]">
          <div className="flex items-end justify-between md:hidden text-white">
            <h1 className="">
              <span className="text-4xl">$3.49</span>
              <span className="text-lg">/month</span>
            </h1>
            <p>$35/year</p>
          </div>
          <div className="flex items-center md:hidden gap-1 pt-2">
            <Image
              src="/section-logo.png"
              alt="section logo"
              height={50}
              width={100}
              className="h-6 w-[150px]"
            />
            <span className="text-[#FFD200] text-md font-semibold">
              Premium
            </span>
          </div>
          <h1 className="hidden md:block text-4xl text-white font-semibold">
            Unlock macronutrients & allergies with Premium
          </h1>
          <p className="text-xs text-white pt-4 pb-3">
            Enjoy unrestricted access to macromapper premium features for
            $3.49/month
          </p>
          <ul className="w-full md:w-[350px] bg-white p-4 rounded-xl">
            {cardContent.map((value, index) => (
              <li
                key={index}
                className="flex items-center gap-2 pb-2 last:pb-0"
              >
                <span>
                  <Image
                    src="/check-mark.png"
                    alt="check-icon"
                    layout="intrinsic"
                    width={16}
                    height={16}
                  />
                </span>
                <span className="text-sm text-[#272727]">{value}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/auth/upgrade-to-premium"
            className="w-full md:w-[270px] bg-[#FFD200] rounded-full py-3 mt-4 font-bold flex items-center justify-center gap-2"
          >
            <span>GO PREMIUM</span>
            <span>
              <Crown size={20} fill="#000" />
            </span>
          </Link>
        </div>
        <div className="hidden md:block static 992:absolute right-0 992:-top-[47px] w-[470px] h-auto">
          <Image
            src="/subscription-banner.png"
            alt="subscription-banner"
            width={470}
            height={370}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}

export default SubscriptionBanner;
