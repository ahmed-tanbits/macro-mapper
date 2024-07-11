import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";

export const metadata = {
  title: "How to Use Macromapper for Meal Planning - Macromapper",
  description:
    "Learn how to use Macromapper for effective meal planning. Explore our site to find out more.",
  openGraph: {
    title: "How to Use Macromapper for Meal Planning - Macromapper",
    description:
      "Learn how to use Macromapper for effective meal planning. Explore our site to find out more.",
    images: "/meal-planning-thumbnail.png",
    url: "https://yourwebsite.com/blog/how-to-use-macromapper-for-meal-planning",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Use Macromapper for Meal Planning - Macromapper",
    description:
      "Learn how to use Macromapper for effective meal planning. Explore our site to find out more.",
    images: "/meal-planning-thumbnail.png",
  },
};

export default function BlogPost() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <div className="relative w-full h-56 lg:h-80">
          <Image
            src="/meal-planning-thumbnail.png"
            layout="fill"
            placeholder="blur"
            blurDataURL="/meal-planning-thumbnail-blur.png"
            alt="How to Use Macromapper for Meal Planning"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900 bg-opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
            <h1 className="text-white text-3xl lg:text-4xl font-bold">
              How to Use Macromapper for Meal Planning
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
            Meal Planning with Macromapper: A Comprehensive Guide
          </h2>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            Planning your meals effectively can be challenging, but with
            Macromapper, it becomes a breeze. Here are some tips on how to use
            Macromapper for meal planning:
          </p>
          <ul className="mt-4 text-md sm:text-lg text-neutral-700 list-disc list-inside">
            <li>Set your nutritional goals based on your health objectives.</li>
            <li>Use Macromapper to find recipes that meet your macro needs.</li>
            <li>
              Plan your meals for the week to ensure you stay on track with your
              goals.
            </li>
            <li>Track your intake and adjust as necessary.</li>
          </ul>
          <p className="mt-4 text-md sm:text-lg text-neutral-700">
            Discover how easy meal planning can be with Macromapper. Explore our
            site to learn more about our features and find nearby restaurants
            offering meals that fit your plan.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
