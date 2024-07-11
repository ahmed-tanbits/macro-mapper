// app/terms-and-conditions/page.js
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsAndConditions() {
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
              Terms and Conditions
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
                Terms and Conditions
              </h1>
            </div>
          </div>
        </div>
        <div className="w-full mt-16 lg:mt-32 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto pb-52">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            Terms and Conditions
          </h2>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            Welcome to Macromapper. By accessing our website, you agree to
            comply with and be bound by the following terms and conditions. If
            you do not agree to these terms, please do not use our website.
          </p>
          <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-neutral-700 mt-6">
            Use of Information
          </h3>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            The information provided on Macromapper is for general informational
            purposes only. While we strive to keep the information accurate and
            up-to-date, we make no representations or warranties of any kind,
            express or implied, about the completeness, accuracy, reliability,
            suitability, or availability with respect to the website or the
            information, products, services, or related graphics contained on
            the website for any purpose. Any reliance you place on such
            information is therefore strictly at your own risk.
          </p>
          <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-neutral-700 mt-6">
            Limitation of Liability
          </h3>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            In no event will we be liable for any loss or damage including
            without limitation, indirect or consequential loss or damage, or any
            loss or damage whatsoever arising from loss of data or profits
            arising out of, or in connection with, the use of this website.
          </p>
          <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-neutral-700 mt-6">
            Accuracy of Information
          </h3>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            We make every effort to ensure that the nutritional information for
            the foods listed on our site is accurate. However, the actual
            nutritional values may vary depending on the restaurant and the
            preparation of the food. We recommend that users independently
            verify the information provided before making dietary decisions.
          </p>
          <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-neutral-700 mt-6">
            Changes to Terms
          </h3>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            Macromapper reserves the right to modify these terms and conditions
            at any time. Any changes will be posted on this page. Your continued
            use of the website after any changes are made constitutes your
            acceptance of the new terms.
          </p>
          <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-neutral-700 mt-6">
            Contact Us
          </h3>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            If you have any questions about these terms and conditions, please
            contact us.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
