import React from "react";
import Banner from "../Banner";

const Signup: React.FC = () => {
  return (
    <section className="grid grid-cols-12">
      <div className="col-span-12 sm:col-span-6 md:col-span-5 w-full p-4 lg:p-16 bg-[#09BE06] sm:bg-white h-screen overflow-y-auto">
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-[#2E3139] text-2xl md:text-3xl font-bold pb-1">
            Get Started Now
          </h2>
          <p className="text-[#425583] ">Let’s create your account</p>

          <form action="" className="mt-4 flex flex-col gap-3 sm:gap-5">
            <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
              <label htmlFor="name" className="text-[#2E3139] text-sm">
                Full Name
              </label>
              <div className="border mt-1 focus-within:border-[#09BE06] rounded-full h-[48px] sm:h-[55px] flex items-center gap-3 px-4 transition-colors">
                <span className="">👤</span>
                <input
                  type="text"
                  placeholder=""
                  className="border-0 shadow-none outline-0 peer hover:outline-0 focus:shadow-none w-full"
                />
                <span className="">👤</span>
              </div>
            </fieldset>
          </form>
          <form action="" className="mt-4 flex flex-col gap-3 sm:gap-5">
            <fieldset className="border border-transparent rounded-lg transition-colors peer-focus-within:border-[#09BE06]">
              <label htmlFor="name" className="text-[#2E3139] text-sm">
                Full Name
              </label>
              <div className="border mt-1 focus-within:border-[#09BE06] rounded-full h-[48px] sm:h-[55px] flex items-center gap-3 px-4 transition-colors">
                <span className="">👤</span>
                <input
                  type="text"
                  placeholder=""
                  className="border-0 shadow-none outline-0 peer hover:outline-0 focus:shadow-none w-full"
                />
                <span className="">👤</span>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
      <Banner
        label="The Ultimate Diet Tool"
        para="Search thousands of products by calories, macronutrients, allergies and location. Finding foods that meet your diet has never been easier."
      />
    </section>
  );
};

export default Signup;
