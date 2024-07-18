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

// Card component
function Card({
  icon,
  label,
  onClick,
}: {
  icon: JSX.Element;
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col w-full items-center justify-center text-center gap-3 md:gap-4 text-xs sm:text-sm lg:text-base font-semibold">
      <div
        className="w-full h-auto hover:shadow cursor-pointer transition-all shadow-md bg-white aspect-square hover:bg-neutral-50 border border-neutral-100 flex items-center justify-center rounded-2xl"
        onClick={onClick}
      >
        {icon}
      </div>
      <span>{label}</span>
    </div>
  );
}

// InfoCard component
function InfoCard({
  icon,
  title,
  link,
}: {
  icon: JSX.Element;
  title: string;
  link: string;
  // linkText: string;
}) {
  return (
    <Link
      href={link}
      target="_blank"
      className="w-auto flex flex-col items-start justify-start text-start lg:gap-2 mb-4 lg:mb-0"
    >
      <div className="h-60 w-full bg-neutral-100 border border-neutral-200 flex items-center justify-center rounded-2xl relative overflow-hidden">
        {icon}
      </div>
      <span className="text-base lg:text-xl font-semibold mt-2">{title}</span>
      <span className="text-sm lg:text-base font-semibold underline mt-1 text-primary-500">
        {title}
      </span>
    </Link>
  );
}

export default function Home() {
  const { setFilters } = useFilterContext();
  const router = useRouter();

  const popularSearches = [
    {
      icon: (
        <Croissant size={52} className="text-neutral-800" strokeWidth={1.3} />
      ),
      label: "Under 400 Calories",
      filters: { calories: [0, 400] },
    },
    {
      icon: <Beef size={52} className="text-neutral-800" strokeWidth={1.3} />,
      label: "Over 30g Protein",
      filters: { protein: [30, 100] },
    },
    {
      icon: (
        <MilkOff size={52} className="text-neutral-800" strokeWidth={1.3} />
      ),
      label: "Dairy Free",
      filters: { allergies: [{ key: "is_dairy_free", checked: true }] },
    },
    {
      icon: (
        <WheatOff size={52} className="text-neutral-800" strokeWidth={1.3} />
      ),
      label: "Gluten Free",
      filters: { allergies: [{ key: "is_gluten_free", checked: true }] },
    },
    {
      icon: <Cookie size={52} className="text-neutral-800" strokeWidth={1.3} />,
      label: "Under 5g Carbs",
      filters: { carbs: [0, 5] },
    },
  ];

  const handleCardClick = (
    filterUpdates: Partial<(typeof popularSearches)[0]["filters"]>
  ) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      ...filterUpdates,
    }));
    router.push("/search/map");
  };

  const infoCards = [
    {
      icon: (
        <Image
          src="/2.png"
          alt="Get Your Menu Mapped macromapper"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      ),
      title: "Get Your Menu Mapped",
      subtitle: "Get Listed on MacroMapper",
      link: "https://get.macromapper.co/macromapping",
    },
    {
      icon: (
        <Image
          src="/3.png"
          alt="Macromapper's Vision macromapper"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      ),
      title: "Macromapper's Vision",
      subtitle: "About MacroMapper",
      link: "https://get.macromapper.co/about-us",
    },
    {
      icon: (
        <Image
          src="/1.png"
          alt="Calorie Calculator macromapper"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      ),
      title: "Calorie Calculator",
      subtitle: "Learn how to use MacroMapper",
      link: "https://get.macromapper.co/calculator",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="relative">
        <div className="relative hidden lg:block w-full h-96">
          <Image
            src="/cover.jpeg"
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL="/blurred-cover.jpeg"
            alt="Cover Image"
            className="h-full"
          />
          <div className="absolute inset-0 bg-neutral-900 bg-opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
            <h1 className="text-white text-3xl lg:text-6xl font-black">
              Discover Foods That Fit Your Diet
            </h1>
          </div>
          <div className="absolute z-10 -bottom-6 -mb-2 gap-4 left-1/2 transform -translate-x-1/2 max-w-2xl w-full flex flex-col items-center justify-center">
            <SearchBar />
          </div>
        </div>
        <div className="block py-2 mt-4 lg:hidden px-4 md:px-8 overflow-x-clip">
          <SearchBar />
        </div>
        <div className="w-full mt-8 lg:mt-16 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto">
          <FiltersSection />
        </div>
        <div className="w-full mt-16 lg:mt-32 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            Popular Filters
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 w-full justify-between xl:grid-cols-5 gap-5 mt-8 md:mt-10 lg:mt-14">
            {popularSearches.map((item, index) => (
              <Card
                key={index}
                icon={item.icon}
                label={item.label}
                onClick={() => handleCardClick(item.filters)}
              />
            ))}
          </div>
        </div>
        <div className="w-full mt-16 lg:mt-32 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto ">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold text-neutral-700">
            Get started with macromapper
          </h2>
          <div className="grid lg:grid-cols-3 mt-8 md:mt-10 lg:mt-14 gap-5 lg:gap-20 w-full">
            {infoCards.map((item, index) => (
              <InfoCard
                key={index}
                icon={item.icon}
                title={item.title}
                link={item.link}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-start w-full mt-16 lg:mt-32 pt-12 max-w-screen-xl px-4 lg:px-16 xl:px-20 mx-auto pb-20 border-t border-neutral-100">
          <span className="font-medium text-lg ">Disclaimer</span>
          <p className="text-sm">
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
        </div>
      </main>
      <Footer />
    </>
  );
}

const FiltersSection = () => {
  const { filters, syncFilters } = useFilterContext();

  const handleSelectionChange = (type: string, selectedOptions: any) => {
    const newFilters = { ...filters, [type]: selectedOptions };
    syncFilters(newFilters);
  };

  const handleRangeChange = (type: string, range: [number, number]) => {
    const newFilters = { ...filters, [type]: range };
    syncFilters(newFilters);
  };

  return (
    <div className="mt-4">
      <Filters
        filters={filters}
        onSelectionChange={handleSelectionChange}
        onRangeChange={handleRangeChange}
      />
    </div>
  );
};
