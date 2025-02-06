"use client";
import React, { useEffect, useState } from "react";
import FilterBar from "../components/filters/FilterBar";
import RestaurantFilterBar from "../components/filters/RestaurantFilterBar";
import Sidebar from "../components/results/Sidebar";
import Toggle from "../components/Toggle";
// import Navbar from "../components/Navbar";
import { useSearchParams } from "next/navigation";
import { useFilterContext } from "@/app/context/FilterContext";
import MapCanvas from "../components/map/MapCanvas";
import Navbar from "@/app/components/Navbar";

type Props = {};

export default function Map({}: Props) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "foods";
  const isRestaurantTab = tab === "restaurants";

  const { filters, setFilters, syncFilters } = useFilterContext();
  const [localFilters, setLocalFilters] = useState(filters);
  const [restFilters, setRestFilters] = useState({
    cuisines: [] as string[],
  });

  const [highlightedRestaurantId, setHighlightedRestaurantId] = useState<
    string | null
  >(null);
  const [isMapView, setIsMapView] = useState(false); // Set to false for list view as default
  const [mapKey, setMapKey] = useState(0); // Add a key to force re-render

  useEffect(() => {
    // Sync local state with context state
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    // Increment the key to force MapCanvas to re-render
    setMapKey((prevKey) => prevKey + 1);
  }, [isMapView]);

  const handleFilterChange = (newFilters: any) => {
    if (isRestaurantTab) {
      setRestFilters(newFilters);
    } else {
      setLocalFilters(newFilters);
      syncFilters(newFilters); // Sync context with local changes
    }
  };

  const handleHighlightLocations = (rest_id: string) => {
    setHighlightedRestaurantId(rest_id);
  };

  const clearHighlightedLocations = () => {
    setHighlightedRestaurantId(null);
  };

  return (
    <>
      <Navbar />
      <main className="w-full">
        {/* {isRestaurantTab ? (
          <RestaurantFilterBar onFilterChange={handleFilterChange} />
        ) : (
          <FilterBar
            filters={localFilters}
            onFilterChange={handleFilterChange}
          />
        )} */}
        {/* <FilterBar filters={localFilters} onFilterChange={handleFilterChange} /> */}
        <div className={`lg:block ${isMapView ? "block " : "hidden"}`}>
          <div className="fixed inset-0 lg:inset-y-0 lg:left-1/3 top-[7.6rem]  z-10 lg:pb-4 select-none w-full lg:w-2/3 transform transition-transform duration-300 flex justify-start items-start bg-neutral-50">
            <MapCanvas
              key={mapKey} // Add key to force re-render
              highlightedRestaurantId={highlightedRestaurantId}
              clearHighlightedLocations={clearHighlightedLocations}
            />
          </div>
        </div>
        <div className={`lg:block ${isMapView ? "hidden" : "block"}`}>
          <Sidebar
            filters={localFilters}
            restFilters={restFilters}
            onHighlightLocations={handleHighlightLocations}
            toggleView={() => setIsMapView(true)}
          />
        </div>
        <Toggle isMap={isMapView} toggleView={() => setIsMapView(!isMapView)} />
        {/* <Navbar /> */}
      </main>
    </>
  );
}
