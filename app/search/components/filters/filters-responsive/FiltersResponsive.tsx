import React, { useRef, useState, useEffect } from "react";
import DropdownCheckbox from "./DropdownCheckbox";
import RangeSlider from "./RangeSlider";
import { debounce } from "@/utils/debounce";
import Image from "next/image";

type Props = {
  filters: any;
  onSelectionChange: (type: string, selectedOptions: any) => void;
  onRangeChange: (type: string, range: [number, number]) => void;
};

const allergyOptions = [
  { id: 1, label: "Gluten Free", key: "is_gluten_free", checked: false },
  { id: 2, label: "Dairy Free", key: "is_dairy_free", checked: false },
  { id: 3, label: "Nut Free", key: "is_nut_free", checked: false },
  { id: 4, label: "Soy Free", key: "is_soy_free", checked: false },
  { id: 5, label: "Egg Free", key: "is_egg_free", checked: false },
  { id: 6, label: "Sesame Free", key: "is_sesame_free", checked: false },
  { id: 7, label: "Sulfite Free", key: "is_sulfite_free", checked: false },
  { id: 8, label: "Vegetarian", key: "is_vegetarian", checked: false },
  { id: 9, label: "Vegan", key: "is_vegan", checked: false },
  {
    id: 10,
    label: "Shellfish Free",
    key: "is_shell_fish_free",
    checked: false,
  },
];

const getAllergyOptions = (filters: any) => {
  return allergyOptions.map((option) => ({
    ...option,
    checked:
      filters.allergies.find((allergy: any) => allergy.key === option.key)
        ?.checked || false,
  }));
};

export default function FiltersResponsive({
  filters,
  onSelectionChange,
  onRangeChange,
}: Props) {
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const [isScrolledToStart, setIsScrolledToStart] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } =
          scrollContainerRef.current;
        setIsScrolledToEnd(scrollLeft + clientWidth >= scrollWidth - 1);
        setIsScrolledToStart(scrollLeft === 0);
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleDebouncedRangeChange = debounce(
    (type: string, range: [number, number]) => {
      onRangeChange(type, range);
    },
    500
  ); // 500ms debounce time

  return (
    <div className="relative bg-white">
      <div className="absolute top-0 left-0 bg-white z-30 h-11">
        <Image
          src={"/logo-square.png"}
          width={50}
          height={50}
          alt="macromapper filter bar square logo"
          className=" lg:hidden aspect-square w-auto h-10 "
        />
      </div>
      {!isScrolledToStart && (
        <div className="absolute h-full w-24 left-10 bg-gradient-to-r from-white to-transparent top-0 flex items-center justify-start cursor-pointer"></div>
      )}
      {!isScrolledToEnd && (
        <div className="absolute h-full w-10 right-0 bg-gradient-to-l from-white to-transparent top-0 flex items-center justify-end cursor-pointer"></div>
      )}
      <div
        ref={scrollContainerRef}
        className="mt-4 pl-14 flex gap-3 items-start justify-start w-full max-w-full overflow-x-scroll hide-scrollbar"
      >
        <DropdownCheckbox
          options={getAllergyOptions(filters)}
          label="Allergies"
          onSelectionChange={(selectedOptions) =>
            onSelectionChange("allergies", selectedOptions)
          }
        />

        <RangeSlider
          label="Calories"
          unit="cals"
          min={0}
          max={2000}
          step={10}
          onRangeChange={(range) =>
            handleDebouncedRangeChange("calories", range)
          }
          initialValues={filters.calories}
        />
        <RangeSlider
          label="Fat"
          unit="grams"
          min={0}
          max={200}
          step={1}
          onRangeChange={(range) => handleDebouncedRangeChange("fat", range)}
          initialValues={filters.fat}
        />
        <RangeSlider
          label="Protein"
          unit="grams"
          min={0}
          max={100}
          step={1}
          onRangeChange={(range) =>
            handleDebouncedRangeChange("protein", range)
          }
          initialValues={filters.protein}
        />
        <RangeSlider
          label="Carbs"
          unit="grams"
          min={0}
          max={1000}
          step={1}
          onRangeChange={(range) => handleDebouncedRangeChange("carbs", range)}
          initialValues={filters.carbs}
        />
        <RangeSlider
          label="Sodium"
          unit="mg"
          min={0}
          max={5000}
          step={5}
          initialValues={filters.sodium}
          onRangeChange={(range) => handleDebouncedRangeChange("sodium", range)}
        />
        <RangeSlider
          label="Fibre"
          unit="grams"
          min={0}
          max={200}
          step={1}
          initialValues={filters.fibre}
          onRangeChange={(range) => handleDebouncedRangeChange("fibre", range)}
        />
        <RangeSlider
          label="Sugars"
          unit="grams"
          min={0}
          max={200}
          step={1}
          initialValues={filters.sugars}
          onRangeChange={(range) => handleDebouncedRangeChange("sugars", range)}
        />
      </div>
    </div>
  );
}
