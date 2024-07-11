"use client";
import React from "react";
import CusCheckbox from "./CusCheckbox";

const cuisineOptions = [
  { id: 1, label: "Mexican", key: "Mexican", checked: false },
  {
    id: 2,
    label: "Fast food restaurant",
    key: "Fast food restaurant",
    checked: false,
  },
];

export default function RestaurantFilters({ onSelectionChange }: any) {
  return (
    <div className="flex gap-3 items-center justify-start w-full">
      <CusCheckbox
        options={cuisineOptions}
        label="Cuisines"
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}
