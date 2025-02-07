"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  HandPlatter,
  Utensils,
  MapPin,
  Store,
} from "lucide-react";
import Image from "next/image";
import BadgeList from "../restaurants/BadgeList";
import RestaurantsSvg from "@/app/components/svgs/RestaurantsSvg";
import FoodForkKnifeSvg from "@/app/components/svgs/FoodForkKnifeSvg";
import FoodServingSvg from "@/app/components/svgs/FoodServingSvg";

export interface MenuItem {
  prod_id: string;
  rest_id: string;
  category: string;
  drink_or_food: string;
  product_name: string;
  product_description: string;
  image_id: string;
  price: number;
  serving_size: string;
  kj: number;
  calories: number;
  protein: number;
  total_fat: number;
  saturated_fat: number;
  total_carbs: number;
  sugars: number;
  fibre: number;
  sodium: number;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  is_nut_free: boolean;
  is_soy_free: boolean;
  is_egg_free: boolean;
  is_sesame_free: boolean;
  is_sulfite_free: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_shell_fish_free: boolean;
}

type Props = {
  item: MenuItem;
  proximity?: number;
  onHighlightLocations: (rest_id: string) => void;
  toggleView: () => void; // Add this prop to handle view toggle
  restaurantName?: string;
};

const FoodItem: React.FC<Props> = ({
  item,
  proximity,
  onHighlightLocations,
  restaurantName,
  toggleView,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [isScrolledToStart, setIsScrolledToStart] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>(
    `https://wsuteglijvwrmcsjhhom.supabase.co/storage/v1/object/public/${item.rest_id}/${item.image_id}.jpg`
  );

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } =
          scrollContainerRef.current;
        setIsOverflowing(scrollWidth > clientWidth);
        setIsScrolledToEnd(scrollLeft + clientWidth >= scrollWidth - 1);
        setIsScrolledToStart(scrollLeft <= 0);
      }
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", checkOverflow);
    }

    return () => {
      window.removeEventListener("resize", checkOverflow);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", checkOverflow);
      }
    };
  }, []);

  const handleImageError = () => {
    setImageUrl("/placeholder.png");
  };

  const scrollToEnd = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const scrollToStart = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const handleButtonClick = () => {
    onHighlightLocations(item.rest_id);
    toggleView(); // Toggle to map view
  };

  const renderNutritionalFact = (
    label: string,
    value: number | undefined,
    unit: string = ""
  ) => {
    if (value !== undefined && value > 0) {
      return (
        <div className="py-1.5 px-4 border bg-white border-neutral-200 border-opacity-50 select-none rounded-full whitespace-nowrap">
          <b>{value}</b>
          {unit} {label}
        </div>
      );
    }
    if (value === 0) {
      return (
        <div className="py-1.5 px-4 border bg-white border-neutral-200 border-opacity-50 select-none rounded-full whitespace-nowrap">
          <b>0</b> {label}
        </div>
      );
    }
    return null;
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} meters`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const cardCusinies = [
    "🥗 Vegetarian",
    "🍞 Gluten Free",
    "🥜 Nut Traces",
    "🥚 Egg Free",
    "🥛 Dairy Free",
  ];

  return (
    <div className="w-full rounded-xl shadow-md bg-white border-neutral-100 transition-all">
      <div className="relative group">
        <div className="flex items-start justify-between w-full p-4 relative z-10">
          <div className="flex items-start justify-start flex-col gap-4 flex-1">
            <h2 className="text-lg font-semibold">{item.product_name}</h2>
            <div className="flex items-start justify-start flex-col text-neutral-500 font-normal gap-1.5">
              <span className="text-sm text-[#0AC600] flex justify-start items-center gap-1">
                <RestaurantsSvg color="#0AC600" width={14} height={14} />
                {item.drink_or_food
                  .toLowerCase()
                  .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())}
              </span>
              <span className="text-sm flex justify-start items-center gap-3">
                <FoodForkKnifeSvg height={14} width={14} />
                {item.category
                  .toLowerCase()
                  .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())}
              </span>
              <span className="text-sm flex justify-start items-center gap-3">
                <FoodServingSvg height={14} width={14} />
                {item.serving_size}
              </span>

              {restaurantName && (
                <span className="text-sm flex justify-start items-center gap-1">
                  <Store size={16} />
                  {restaurantName}
                </span>
              )}
              {proximity !== undefined && (
                <span
                  className={`text-sm flex justify-start items-center gap-1 ${
                    proximity < 1 ? "text-primary-500" : ""
                  }`}
                >
                  <MapPin className="text-neutral-500" size={16} />
                  <span className="text-neutral-500">Proximity:</span>
                  <span className="font-medium">
                    {formatDistance(proximity)}
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <Image
              src={imageUrl}
              loading="lazy"
              placeholder={"blur"}
              blurDataURL={"/placeholder.png"}
              width={80}
              height={80}
              alt={item.product_name}
              onError={handleImageError}
              className="object-cover h-full w-auto rounded-xl"
            />
            <div className="absolute inset-0 border border-black/10 rounded-xl pointer-events-none"></div>
          </div>
        </div>
        <div className="w-full overflow-hidden px-3 mt-1">
          <ul className="flex gap-1 items-center w-full overflow-x-auto whitespace-nowrap">
            {cardCusinies.map((value, index) => (
              <li
                className={`text-[12px] px-2 rounded-full py-1 font-semibold ${
                  index === 2 ? "bg-[#f2e4bd]" : "bg-[#bdf2cc]"
                }`}
                key={index}
              >
                {value}
              </li>
            ))}
          </ul>
        </div>
        {/* <div className="w-full overflow-hidden px-3">
          <ul className="flex gap-1 items-center w-full overflow-x-auto whitespace-nowrap">
            {[
              "is_dairy_free",
              "is_egg_free",
              "is_gluten_free",
              "is_nut_free",
              "is_sesame_free",
              "is_shell_fish_free",
              "is_soy_free",
              "is_sulfite_free",
              "is_vegan",
              "is_vegetarian",
            ].map((key) => (
              <li
                key={key}
                className="text-[12px] px-2 rounded-full py-1 font-semibold"
              >
                {item[key]}
              </li>
            ))}
          </ul>
        </div> */}

        <div className="p-4 pt-2 pb-2 relative z-10">
          <BadgeList products={[item]} />
        </div>
        <button onClick={() => onHighlightLocations(item.rest_id)}>
          <div className="absolute inset-0 bg-neutral-50 rounded-t-xl bg-opacity-20 backdrop-blur-sm hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <div className="relative flex items-center bg-white border border-neutral-100 text-neutral-900 px-4 py-2 rounded-full shadow-lg transition-all cursor-pointer select-none whitespace-nowrap group-hover:pr-8">
              <span className="transition-all">Closest locations</span>
              <ChevronRight className="absolute right-2 transition-transform transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300" />
            </div>
          </div>
        </button>
      </div>
      <button
        onClick={handleButtonClick}
        className="flex items-center justify-items-center gap-1 lg:hidden bg-neutral-50 border-t border-neutral-100 text-neutral-900 px-3 py-2 text-sm w-full -mt-4 pt-4"
      >
        View closest locations
        <ChevronsRight strokeWidth={2} size={16} />
      </button>
      <div className="relative bg-neutral-50 px-3 pb-3 pt-3 lg:border-t border-neutral-100 overflow-hidden rounded-b-xl">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto hide-scrollbar"
        >
          {item.price && (
            <div className="py-1.5 px-4 border bg-neutral-900 text-white border-neutral-900 transition-all select-none rounded-full whitespace-nowrap">
              ${item.price}
            </div>
          )}
          {renderNutritionalFact("Cal.", item.calories)}
          {renderNutritionalFact("protein", item.protein, "g")}
          {renderNutritionalFact("fat", item.total_fat, "g")}
          {renderNutritionalFact("saturated fat", item.saturated_fat, "g")}
          {renderNutritionalFact("carbs", item.total_carbs, "g")}
          {renderNutritionalFact("sugars", item.sugars, "g")}
          {renderNutritionalFact("fibre", item.fibre, "g")}
          {renderNutritionalFact("sodium", item.sodium, "mg")}
        </div>

        {isOverflowing && !isScrolledToEnd && (
          <div
            onClick={scrollToEnd}
            className="absolute h-full z-10 w-14 right-0 pr-2 bg-gradient-to-l from-neutral-100 via-neutral-100 to-transparent text-neutral-400 hover:text-neutral-500 transition-all top-0 flex items-center justify-end cursor-pointer"
          >
            <ChevronsRight />
          </div>
        )}
        {isOverflowing && !isScrolledToStart && (
          <div
            onClick={scrollToStart}
            className="absolute h-full z-10 w-14 left-0 pl-2 bg-gradient-to-r from-neutral-100 via-neutral-100 to-transparent text-neutral-400 hover:text-neutral-500 transition-all top-0 flex items-center justify-start cursor-pointer"
          >
            <ChevronsLeft />
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
