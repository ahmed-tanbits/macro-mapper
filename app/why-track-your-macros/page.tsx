import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Why Track Your Macros - Macromapper",
  description:
    "Discover the benefits of tracking your macros with Macromapper. Explore our site to find out more.",
  openGraph: {
    title: "Why Track Your Macros - Macromapper",
    description:
      "Discover the benefits of tracking your macros with Macromapper. Explore our site to find out more.",
    images: "/why-track-your-macros-thumbnail.png",
    url: "https://yourwebsite.com/blog/why-track-your-macros",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Track Your Macros - Macromapper",
    description:
      "Discover the benefits of tracking your macros with Macromapper. Explore our site to find out more.",
    images: "/why-track-your-macros-thumbnail.png",
  },
};

export default function BlogPost() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <div className="relative w-full h-56 lg:h-80">
          <Image
            src="/why-track-your-macros-thumbnail.png"
            layout="fill"
            placeholder="blur"
            blurDataURL="/why-track-your-macros-thumbnail-blur.png"
            alt="Why Track Your Macros"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900 bg-opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
            <h1 className="text-white text-3xl lg:text-4xl font-bold">
              Why Track Your Macros
            </h1>
          </div>
          <div className="absolute bottom-2 right-2 z-10 text-white font-bold text-xs">
            Artwork by{" "}
            <Link
              href="https://dribbble.com/felicdesign"
              target="_blank"
              className="underline"
            >
              Felic Illustration
            </Link>
          </div>
        </div>
        <div className="w-full mt-16 lg:mt-32 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto pb-52">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            Benefits of Tracking Your Macros with Macromapper
          </h2>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            Understanding your macronutrient intake is key to achieving your
            health and fitness goals. With Macromapper, tracking your macros
            becomes easy and insightful. Here are some key benefits of tracking
            your macros:
          </p>
          <ul className="mt-4 text-md sm:text-lg text-neutral-700 list-disc list-inside">
            <li>
              Achieve your fitness goals by managing your nutrient intake.
            </li>
            <li>Improve overall health by maintaining a balanced diet.</li>
            <li>Identify and address dietary deficiencies.</li>
            <li>Support weight management with precise macro tracking.</li>
          </ul>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            Ready to take control of your nutrition? Explore our site to
            discover more about Macromapper, including our map functionality and
            nearby restaurants offering detailed macro information.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
