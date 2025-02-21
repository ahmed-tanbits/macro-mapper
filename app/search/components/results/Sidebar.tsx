"use client";
import React, { Suspense } from "react";
import Tabs from "./Tabs";
import List from "./restaurants/List";
import FoodList from "./food-items/List";
import { useSearchParams } from "next/navigation";
import LoadingCard from "./restaurants/LoadingCard";

type FiltersType = {
  allergies: { key: string; checked: boolean }[];
  cuisines: string[];
  calories: [number, number];
  fat: [number, number];
  protein: [number, number];
  carbs: [number, number];
  sodium: [number, number];
  fibre: [number, number];
  sugars: [number, number];
};
type RestFiltersType = {
  cuisines: string[];
};

type Props = {
  filters: FiltersType;
  restFilters: RestFiltersType;
  onHighlightLocations: (rest_id: string) => void;
  toggleView: () => void; // Add this line
};

function SidebarContent({
  filters,
  restFilters,
  onHighlightLocations,
  toggleView,
}: Props) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "foods";
  const activeTab = tab.includes("foods") ? "Foods" : "Restaurants";

  return (
    <>
      <Tabs />
      {activeTab === "Restaurants" ? (
        <List restFilters={restFilters} />
      ) : (
        <FoodList
          filters={filters}
          onHighlightLocations={onHighlightLocations}
          toggleView={toggleView} // Add this line
        />
      )}
    </>
  );
}

export default function Sidebar({
  filters,
  restFilters,
  onHighlightLocations,
  toggleView,
}: Props) {
  return (
    <div
      className={`fixed inset-y-0 top-[15.5rem] 439:top-[13.5rem] sm:top-[10.4rem] 1200:top-[7.6rem] select-none flex flex-col justify-start left-0 z-20 w-full lg:w-1/3 transform bg-neutral-50 transition-transform duration-300`}
    >
      <Suspense fallback={<LoadingCard />}>
        <SidebarContent
          filters={filters}
          restFilters={restFilters}
          onHighlightLocations={onHighlightLocations}
          toggleView={toggleView} // Add this line
        />
      </Suspense>
    </div>
  );
}
