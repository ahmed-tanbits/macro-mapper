import React from "react";
import Banner from "../Banner";
import Image from "next/image";
import Link from "next/link";

const UpgradeToPremium: React.FC = () => {
  const pageContent = [
    {
      lable: "Filter by Macronutrients",
      para: "Find more meals that meet your requirements with protein, carbohydrates and fat filters.",
    },
    {
      lable: "Filter for Dietary Restrictions",
      para: "Filter by 10 types of dietary restrictions, including gluten-free, vegetarian, nut-free and more.",
    },
    {
      lable: "Support MacroMapper’s Vision",
      para: "Macromapper is determined to be the leading food finding platform, showcasing thousands of restaurants and products. Join us on our journey and help us expand!",
    },
  ];

  return (
    <>
      <section className="grid grid-cols-12">
        <div className="col-span-12 sm:col-span-6 md:col-span-5 w-full p-4 lg:p-16 bg-[#09BE06] sm:bg-white h-screen">
          <div className="bg-white p-4 rounded-2xl mb-2">
            <h2 className="text-[#2E3139] text-2xl md:text-3xl font-bold pb-1 text-center">
              Upgrade to Premium
            </h2>
            <p className="text-[#425583] text-center">
              Unlock macromapper’s true potential.
            </p>
          </div>

          <div className="icons">
            <div className="bg-[#FFD200] aspect-square h-[150px] w-[150px] grid items-center justify-center rounded-full">
              <Image
                src="/crown-icon.png"
                alt="check-icon"
                width={16}
                height={16}
                className="w-[18px] h-[18px] mt-1 "
              />
            </div>
          </div>
          <ul className="flex flex-col gap-4 sm:gap-5">
            {pageContent.map((value, index) => (
              <li key={index} className="flex gap-2">
                <Image
                  src="/check-mark.png"
                  alt="check-icon"
                  width={16}
                  height={16}
                  className="w-[18px] h-[18px] mt-1"
                />
                <div>
                  <p className="font-bold text-[#2E3139]">{value.lable}</p>
                  <p className="text-[#6C6C6C] font-extralight text-sm">
                    {value.para}
                  </p>
                </div>
              </li>
            ))}

            <li className="mt-1">
              <button className="block w-full text-white border border-[#0AC600] bg-[#0AC600] font-medium rounded-lg py-3 text-center">
                $ 29.99 Year
              </button>
            </li>
            <li className="mt-1">
              <button className="block w-full text-black border border-[#CBCBCB] bg-[#f8f8f8] font-medium rounded-lg py-3 text-center">
                $ 3.49 Month
              </button>
            </li>
            <li className="mt-1 mx-auto">
              <Link href={""} className="text-[#6C6C6C]">
                Skip
              </Link>
            </li>
          </ul>
        </div>
        <Banner />
      </section>
    </>
  );
};

export default UpgradeToPremium;
