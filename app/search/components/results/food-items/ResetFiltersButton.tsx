"use client";
import React from "react";
import { useFilterContext } from "@/app/context/FilterContext";
import { RotateCcw } from "lucide-react";

const ResetFiltersButton: React.FC = () => {
  const { filters, setFilters } = useFilterContext();

  const hasActiveFilters = () => {
    const defaultFilters = {
      allergies: [
        { key: "is_gluten_free", checked: false },
        { key: "is_dairy_free", checked: false },
        { key: "is_nut_free", checked: false },
        { key: "is_soy_free", checked: false },
        { key: "is_egg_free", checked: false },
        { key: "is_sesame_free", checked: false },
        { key: "is_sulfite_free", checked: false },
        { key: "is_vegetarian", checked: false },
        { key: "is_vegan", checked: false },
        { key: "is_shell_fish_free", checked: false },
      ],
      cuisines: [],
      calories: [0, 2000],
      fat: [0, 200],
      protein: [0, 100],
      carbs: [0, 1000],
      sodium: [0, 5000],
      fibre: [0, 200],
      sugars: [0, 200],
    };

    return (
      JSON.stringify(filters) !== JSON.stringify(defaultFilters)
    );
  };

  const resetFilters = () => {
    setFilters({
      allergies: [
        { key: "is_gluten_free", checked: false },
        { key: "is_dairy_free", checked: false },
        { key: "is_nut_free", checked: false },
        { key: "is_soy_free", checked: false },
        { key: "is_egg_free", checked: false },
        { key: "is_sesame_free", checked: false },
        { key: "is_sulfite_free", checked: false },
        { key: "is_vegetarian", checked: false },
        { key: "is_vegan", checked: false },
        { key: "is_shell_fish_free", checked: false },
      ],
      cuisines: [],
      calories: [0, 2000],
      fat: [0, 200],
      protein: [0, 100],
      carbs: [0, 1000],
      sodium: [0, 5000],
      fibre: [0, 200],
      sugars: [0, 200],
    });
  };

  if (!hasActiveFilters()) {
    return null;
  }

  return (
    <>
      {/* <button
      onClick={resetFilters}
      className="px-4 py-2 text-neutral-500 border border-neutral-100 bg-white rounded-xl flex items-center justify-center space-x-2 hover:text-yellow-600 hover:border-yellow-600 transition-colors duration-200 hover:bg-yellow-500 hover:bg-opacity-15"
    >
      <RotateCcw size={16} />
      <span>Reset Filters</span>
    </button> */}
    </>
  );
};

export default ResetFiltersButton;
