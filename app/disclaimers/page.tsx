// app/disclaimers/page.js
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Disclaimers() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <div className="relative hidden lg:block w-full h-80">
          <Image
            src="/cover.jpeg"
            width={2000}
            height={600}
            placeholder="blur"
            blurDataURL="/blurred-cover.jpeg"
            alt="Cover Image"
            className="h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900 bg-opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
            <h1 className="text-white text-3xl lg:text-4xl font-bold">
              Disclaimers
            </h1>
          </div>
        </div>
        <div className="block py-2 mt-4 lg:hidden px-4 md:px-8 overflow-x-clip">
          <div className="relative w-full h-40">
            <Image
              src="/cover.jpeg"
              layout="fill"
              placeholder="blur"
              blurDataURL="/blurred-cover.jpeg"
              alt="Cover Image"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-neutral-900 bg-opacity-40"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
              <h1 className="text-white text-xl lg:text-3xl font-bold">
                Disclaimers
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full mt-16 lg:mt-32 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto pb-52">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            General Disclaimer
          </h2>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            The macronutrient data, allergen information, and product details
            presented on MacroMapper are indicative and sourced based on methods
            agreed upon by the respective restaurants and/or MacroMapper. While
            we strive to provide accurate and up-to-date information, the
            details should not be considered 100% accurate. MacroMapper is not
            liable for the absolute accuracy of this information, nor for any
            adverse effects or harm that may result from reliance on the
            content. Users are advised to verify critical information directly
            with the establishment if necessary.
          </p>
          <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-neutral-700 mt-6">
            Nutritional Information Disclaimer
          </h3>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            While we strive to provide accurate nutritional information, the
            values may vary depending on the restaurant and food preparation
            methods. We recommend that users independently verify the
            nutritional information before making dietary decisions.
          </p>
          <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-neutral-700 mt-6">
            External Links Disclaimer
          </h3>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            The site may contain links to other websites or content belonging to
            or originating from third parties or links to websites and features
            in banners or other advertising. Such external links are not
            investigated, monitored, or checked for accuracy, adequacy,
            validity, reliability, availability, or completeness by us.
          </p>
          <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-neutral-700 mt-6">
            Contact Us
          </h3>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            If you have any questions or concerns about these disclaimers,
            please contact us.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
