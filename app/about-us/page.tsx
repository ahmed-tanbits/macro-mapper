// app/about/page.js
import Image from "next/image";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "About Us - Macromapper",
  description:
    "Macromapper: Discover nutritional information and macros of restaurants across Australia. Find protein, allergens, and more to make informed dining choices.",
  openGraph: {
    title: "About Us - Macromapper",
    description:
      "Macromapper: Discover nutritional information and macros of restaurants across Australia. Find protein, allergens, and more to make informed dining choices.",
    images: "/images/macromapper-og-image.jpg",
    url: "https://yourwebsite.com/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Macromapper",
    description:
      "Macromapper: Discover nutritional information and macros of restaurants across Australia. Find protein, allergens, and more to make informed dining choices.",
    images: "/images/macromapper-og-image.jpg",
  },
};

export default function About() {
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
              Discover More About Macromapper
            </h1>
          </div>
        </div>
        <div className="block py-2 mt-4 lg:hidden px-4 md:px-8 overflow-x-clip ">
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
                Discover More About Macromapper
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full mt-16 lg:mt-32 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto pb-52">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            Our Mission
          </h2>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            MacroMapper is a powerful search tool that provides detailed
            nutritional information for over 10,000 food items across 15,000
            locations in Australia. Designed to help health-conscious
            individuals make informed dietary choices while dining out,
            MacroMapper allows users to search for meals based on calories,
            cuisine type, macronutrients, and allergies. With plans to expand
            further, the platform aims to be the go-to resource for those
            looking to maintain their dietary goals.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
