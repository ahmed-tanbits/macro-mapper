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
        <div className="col-span-12 sm:col-span-7 992:col-span-5 w-full p-4 lg:p-16 bg-[#09BE06] sm:bg-white h-screen overflow-x-auto">
          <div className="w-full mx-auto bg-white p-4 rounded-2xl ">
            <div className="bg-white p-4 rounded-2xl mb-2">
              <h2 className="text-[#2E3139] text-xl md:text-3xl font-bold pb-1 text-center">
                Upgrade to Premium
              </h2>
              <p className="text-[#425583] text-center text-sm md:text-base">
                Unlock macromapper’s true potential.
              </p>
            </div>

            <div className="relative -ms-4 350:mx-auto w-[300px]">
              <div className=" bg-[#FFD200] aspect-square h-[100px] 425:h-[130px] w-[100px] 425:w-[130px] grid items-center justify-center rounded-full mx-auto mt-5 mb-8">
                <Image
                  src="/crown-icon.png"
                  alt="check-icon"
                  width={100}
                  height={100}
                  className="w-[60px] 425:w-[80px] h-[60px] 425:h-[80px] mt-1"
                />
              </div>
              <ul>
                <li className="absolute top-3 425:top-4 left-5 425:-left-3 z-10 flex gap-2 425:gap-3 items-center px-4 425:px-6 py-1 425:py-2 shadow-xl bg-white rounded-2xl rounded-br-none">
                  <Image
                    src="/unlock-icon.png"
                    alt="check-icon"
                    width={100}
                    height={100}
                    className="w-[10px] 425:w-[13px] h-[12px] 425:h-[15px]"
                  />
                  <span className="text-sm font-light">Protein</span>
                </li>
                <li className="absolute bottom-6 425:bottom-8 left-8 425:left-1 z-10 flex gap-2 425:gap-3 items-center px-4 425:px-6 py-1 425:py-2 shadow-xl bg-white rounded-2xl rounded-br-none">
                  <Image
                    src="/unlock-icon.png"
                    alt="check-icon"
                    width={100}
                    height={100}
                    className="w-[10px] 425:w-[13px] h-[12px] 425:h-[15px]"
                  />
                  <span className="text-sm font-light">Carbs</span>
                </li>
                <li className="absolute top-9 425:top-12 right-10 425:right-2 z-10 flex gap-2 425:gap-3 items-center px-4 425:px-6 py-1 425:py-2 shadow-xl bg-[#0AC600] rounded-2xl rounded-tl-none text-white">
                  <Image
                    src="/unlock-icon.png"
                    alt="check-icon"
                    width={100}
                    height={100}
                    className="w-[10px] 425:w-[13px] h-[12px] 425:h-[15px]"
                  />
                  <span className="text-[12px] 425:text-sm font-light">
                    Fats
                  </span>
                </li>
                <li className="absolute bottom-1 425:bottom-0 right-6 425:-right-4 z-10 flex gap-2 425:gap-3 items-center px-4 425:px-6 py-1 425:py-2 shadow-xl bg-[#0AC600] rounded-2xl rounded-tl-none text-white">
                  <Image
                    src="/unlock-icon.png"
                    alt="check-icon"
                    width={100}
                    height={100}
                    className="w-[10px] 425:w-[13px] h-[12px] 425:h-[15px]"
                  />
                  <span className="text-[12px] 425:text-sm font-light">
                    Allergies
                  </span>
                </li>
              </ul>
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
                <button className="block w-full text-white border border-[#0AC600] bg-[#0AC600] font-bold rounded-lg py-3 text-center">
                  $ 29.99 Year
                </button>
              </li>
              <li className="mt-1">
                <button className="block w-full text-black border border-black bg-[#f8f8f8] font-bold rounded-lg py-3 text-center">
                  $ 3.49 Month
                </button>
              </li>
              <li className="mt-1 mx-auto">
                <Link href={"/"} className="text-[#6C6C6C]">
                  Skip
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Banner />
      </section>
    </>
  );
};

export default UpgradeToPremium;
