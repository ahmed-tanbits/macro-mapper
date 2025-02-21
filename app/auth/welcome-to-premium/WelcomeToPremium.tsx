import React from "react";
import Banner from "../Banner";
import Image from "next/image";
import Link from "next/link";

const WelcomeToPremium: React.FC = () => {
  return (
    <>
      <section className="grid grid-cols-12">
        <div className="col-span-12 sm:col-span-7 992:col-span-5 w-full p-4 lg:p-16 bg-[#09BE06] sm:bg-white h-screen overflow-x-auto">
          <div className="w-full mx-auto bg-white p-4 rounded-2xl ">
            <div className="bg-white p-4 rounded-2xl mb-2">
              <h2 className="text-[#2E3139] text-2xl md:text-3xl font-bold pb-1 text-center">
                Welcome to Premium!
              </h2>
            </div>

            <div className=" bg-[#FFD200] aspect-square h-[100px] 425:h-[130px] w-[100px] 425:w-[130px] grid items-center justify-center rounded-full mx-auto mt-5 mb-8">
              <Image
                src="/check-mark.png"
                alt="check-icon"
                width={100}
                height={100}
                className="w-[60px] 425:w-[80px] h-[60px] 425:h-[80px] mt-1"
              />
            </div>
            <h2 className="text-[#2E3139] text-2xl md:text-3xl font-bold pb-4 text-center">
              Subscription activated
            </h2>
            <p className="text-[#425583] text-center text-sm font-normal md:text-base pb-4">
              Congratulations, you have successfully activate Premium access to
              all the features of MacroMapper.
            </p>
            <ul className="flex flex-col gap-4 sm:gap-5">
              <li className="mt-1">
                <Link
                  href={"/"}
                  className="block w-full text-white border text-sm border-[#0AC600] bg-[#0AC600] font-bold rounded-lg py-3 text-center"
                >
                  Search MacroMapper
                </Link>
              </li>
              <li className="mt-1">
                <Link
                  href={"/auth/user-profile"}
                  className="block w-full text-black border text-sm border-black bg-[#f8f8f8] font-bold rounded-lg py-3 text-center"
                >
                  View Profile
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

export default WelcomeToPremium;
