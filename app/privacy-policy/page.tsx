// app/privacy-policy/page.js
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
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
              Privacy Policy
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
                Privacy Policy
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full mt-16 lg:mt-32 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            Our Privacy Policy
          </h2>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            At Macromapper, your privacy is important to us. We do not collect
            or track any personal data from our users. Our goal is to provide
            you with detailed nutritional information and macros for restaurants
            across Australia without compromising your privacy.
          </p>
        </div>
        <div className="w-full mt-16 lg:mt-32 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            No Data Collection
          </h2>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            We do not collect, store, or track any personal information from our
            users. You can browse our site with confidence, knowing that your
            privacy is fully protected.
          </p>
        </div>
        <div className="w-full mt-16 lg:mt-32 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto pb-52">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            Contact Us
          </h2>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            If you have any questions or concerns about our privacy practices,
            please contact us. We are here to help and ensure your experience
            with Macromapper is a positive one.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
