"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  HandPlatter,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import BadgeList from "../components/results/restaurants/BadgeList";

const FoodItem: React.FC<{ item: MenuItem }> = ({ item }) => {
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

  return (
    <div className="shadow-sm bg-neutral-50 border border-neutral-100 w-full rounded-xl overflow-clip relative h-min">
      <div className="relative group">
        <div className="flex items-start justify-between w-full p-4 relative z-10">
          <div className="flex items-start justify-start flex-col gap-4 flex-1">
            <h2 className="text-lg font-semibold">{item.product_name}</h2>
            <div className="flex items-start justify-start flex-col text-neutral-500 font-normal gap-1.5">
              <span className="text-sm flex justify-start items-start gap-1">
                <Utensils size={16} />
                {item.drink_or_food}
              </span>
              <span className="text-sm flex justify-start items-start gap-1">
                <HandPlatter size={16} />
                {item.serving_size}
              </span>
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
        <div className="p-4 pt-0 relative z-10">
          <BadgeList products={[item]} />
        </div>
      </div>

      <div className="relative bg-neutral-100 px-3 pb-3 pt-3 border-t border-neutral-100 overflow-hidden">
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
            className="absolute h-full z-10 w-14 right-0 pr-2 bg-gradient-to-l from-neutral-50 via-neutral-50 to-transparent text-neutral-400 hover:text-neutral-500 transition-all top-0 flex items-center justify-end cursor-pointer"
          >
            <ChevronsRight />
          </div>
        )}
        {isOverflowing && !isScrolledToStart && (
          <div
            onClick={scrollToStart}
            className="absolute h-full z-10 w-14 left-0 pl-2 bg-gradient-to-r from-neutral-50 via-neutral-50 to-transparent text-neutral-400 hover:text-neutral-500 transition-all top-0 flex items-center justify-start cursor-pointer"
          >
            <ChevronsLeft />
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
