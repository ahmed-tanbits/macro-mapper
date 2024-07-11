import React from "react";
import RangeSlider from "./RangeSlider";
import DropdownCheckbox from "./DropdownCheckbox";
import { debounce } from "@/utils/debounce";

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

export default function Filters({
  filters,
  onSelectionChange,
  onRangeChange,
}: Props) {
  const handleDebouncedRangeChange = debounce(
    (type: string, range: [number, number]) => {
      onRangeChange(type, range);
    },
    500
  ); // 500ms debounce time

  const getAllergyOptions = () => {
    return allergyOptions.map((option) => ({
      ...option,
      checked:
        filters.allergies.find((allergy: any) => allergy.key === option.key)
          ?.checked || false,
    }));
  };

  return (
    <div className="flex gap-3 items-center justify-start w-full">
      <DropdownCheckbox
        options={getAllergyOptions()}
        label="Allergies"
        onSelectionChange={(selectedOptions) =>
          onSelectionChange("allergies", selectedOptions)
        }
        initialOptions={getAllergyOptions()}
      />
      <RangeSlider
        label="Calories"
        unit="cals"
        min={0}
        max={2000}
        step={10}
        onRangeChange={(range) => handleDebouncedRangeChange("calories", range)}
        initialValues={filters.calories}
      />
      <RangeSlider
        label="Protein"
        unit="grams"
        min={0}
        max={100}
        step={1}
        onRangeChange={(range) => handleDebouncedRangeChange("protein", range)}
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
        label="Fat"
        unit="grams"
        min={0}
        max={200}
        step={1}
        onRangeChange={(range) => handleDebouncedRangeChange("fat", range)}
        initialValues={filters.fat}
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
  );
}
