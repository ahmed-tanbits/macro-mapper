"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Beef, Croissant, Cookie, MilkOff, WheatOff } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { useFilterContext } from "./context/FilterContext";
import Filters from "./components/filters/Filters";
import SubscriptionBanner from "./components/SubscriptionBanner";
import FoodCard from "./components/FoodCard";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronRight, ChevronLeft } from "lucide-react";

const SlickSlider = dynamic(() => import("react-slick"), { ssr: false });

const restaurants = [
  {
    imageSrc: "/restaurant_1.png",
    name: "Smoothie Kingdom",
    category: "Smoothie Bar",
    productCount: 12,
  },
  {
    imageSrc: "/restaurant_2.png",
    name: "Guzman Y Gomez",
    category: "Mexican",
    productCount: 95,
  },
  {
    imageSrc: "/restaurant_3.png",
    name: "Greenstreat",
    category: "Health Food",
    productCount: 43,
  },
  {
    imageSrc: "/restaurant_4.png",
    name: "SpudBAR",
    category: "Health Food",
    productCount: 46,
  },
  {
    imageSrc: "/restaurant_5.png",
    name: "Roll'd",
    category: "Vietnamese",
    productCount: 102,
  },
];

const restaurantBlogsCards = [
  {
    active: "Active",
    imageSrc: "/bottom-sec-img1.png",
    para: "The Optimistic Future of Fast Food Outlets",
  },
  {
    active: "Active",
    imageSrc: "/bottom-sec-img2.png",
    para: "The Most Optimal Diet For Weight-loss.",
  },
  {
    active: "Active",
    imageSrc: "/bottom-sec-img3.png",
    para: "The Top 3 Cardio Programs To Lose Fat That is Backed by Scien...",
  },
  {
    active: "Active",
    imageSrc: "/bottom-sec-img4.png",
    para: "How To Eat Whatever You Want And Lose Fat.",
  },
];

// Custom Arrow Components
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 right-[20px] transform -translate-y-[190%] z-10 h-[22px] w-[22px] bg-gray-400 rounded-full"
  >
    <ChevronRight color="#fff" size={16} className="ms-[3px]" />
  </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 left-[20px] transform -translate-y-[190%] z-10 h-[22px] w-[22px] bg-gray-400 rounded-full"
  >
    <ChevronLeft color="#fff" size={16} className="ms-[3px]" />
  </button>
);

function RestaurantCard({
  imageSrc,
  name,
  category,
  productCount,
}: {
  imageSrc: string;
  name: string;
  category: string;
  productCount: number;
}) {
  return (
    <Link
      href={"https://get.macromapper.co/get-started"}
      className="flex flex-col items-start w-full px-2"
    >
      <div className="min-w-[100px] sm:w-full aspect-square rounded-md overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          width={200}
          height={200}
          className="rounded-md object-cover w-full h-full"
        />
      </div>
      <span className="text-[12px] leading-1 sm:leading-normal sm:text-base font-semibold mt-2">
        {name}
      </span>
      <span className="text-[10px] sm:text-sm text-neutral-500">
        {category}
      </span>
      <span className="text-[10px] sm:text-sm font-semibold text-[#2B2B2B] mt-1 underline">
        {productCount} products to explore
      </span>
    </Link>
  );
}

function RestaurantBlogs({
  active,
  imageSrc,
  para,
}: {
  imageSrc: string;
  active: string;
  para: string;
}) {
  return (
    <Link
      href={"https://get.macromapper.co/get-started"}
      className="flex flex-col items-start w-full px-2"
    >
      <div className="min-w-[100px] sm:w-full h-[170px] rounded-t-2xl overflow-hidden">
        <Image
          src={imageSrc}
          alt="not found"
          width={200}
          height={200}
          className="relative rounded-t-2xl object-cover w-full h-full"
        />
      </div>
      <span className="absolute top-4 ms-6 bg-[#00CF3A] text-white text-[12px] px-3 py-[3px] rounded-xl">
        {active}
      </span>
      <span className="bg-[#F8F8F8] text-[10px] sm:text-sm text-neutral-500 px-4 py-2 h-[60px] w-full rounded-b-2xl">
        {para}
      </span>
    </Link>
  );
}

export default function Home() {
  const sliderSettings = (slidesToShow: number) => ({
    slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    infinite: true,
    dots: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  });

  return (
    <>
      <Navbar />
      <main className="relative">
        {/* Popular Restaurants */}
        <section className="w-full mt-16 max-w-screen-xl px-4 lg:px-16 xl:px-5 mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            Popular Restaurants
          </h2>
          <div className="mt-8 relative">
            <SlickSlider {...sliderSettings(5)}>
              {restaurants.map((restaurant, index) => (
                <RestaurantCard key={index} {...restaurant} />
              ))}
            </SlickSlider>
          </div>
        </section>

        <section className="w-full mt-16 max-w-screen-xl px-4 lg:px-16 xl:px-5 mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            Recently Listed
          </h2>
          <div className="mt-8 relative">
            <SlickSlider {...sliderSettings(5)}>
              {restaurants.map((restaurant, index) => (
                <RestaurantCard key={index} {...restaurant} />
              ))}
            </SlickSlider>
          </div>
        </section>

        {/* Subscription Section Banner */}
        <SubscriptionBanner />
        <FoodCard />
        <section className="w-full max-w-screen-xl px-4 lg:px-16 xl:px-5 mx-auto">
          <div className="mt-8 relative">
            <SlickSlider {...sliderSettings(4)}>
              {restaurantBlogsCards.map((restaurant, index) => (
                <RestaurantBlogs key={index} {...restaurant} />
              ))}
            </SlickSlider>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
