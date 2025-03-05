"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import FoodItem from "./FoodItem";
import { supabase } from "@/supabaseClient";
import LoadingCard from "../restaurants/LoadingCard";
import Sort from "../../filters/Sort";
import SearchBarResponsive from "@/app/search/components/filters/filters-responsive/SearchBarResponsive";
import ResetFiltersButton from "./ResetFiltersButton";
import { useSearch } from "@/app/context/SearchContext";
import Cookies from "js-cookie";
import { capitalize } from "lodash";

type FiltersType = {
  allergies: { key: string; checked: boolean }[];
  cuisines: string[];
  calories: [number, number];
  fat: [number, number];
  protein: [number, number];
  carbs: [number, number];
  sodium: [number, number];
  sugars: [number, number];
  fibre: [number, number];
};

type Props = {
  filters: FiltersType;
  onHighlightLocations: (rest_id: string) => void;
  toggleView: any;
};

export default function FoodList({
  filters,
  onHighlightLocations,
  toggleView,
}: Props) {
  const [foodItems, setFoodItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState<string>("Default");
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const loader = useRef<HTMLDivElement | null>(null);
  const {
    searchTerm,
    selectedLocation
  } = useSearch();

  const userLocation = useRef<any>(
    null
  );

  useEffect(() => {
    // const lat = Cookies.get("latitude");
    // const lon = Cookies.get("longitude");

    const lat = selectedLocation?.coordinates?.[1] || Cookies.get("latitude");
    const lon = selectedLocation?.coordinates?.[0] || Cookies.get("longitude");

    if (lat && lon) {
      userLocation.current = {
        lat: lat,
        long: lon,
      };
    }
  }, [selectedLocation]);

  const sortKeyMap: { [key: string]: string } = {
    "Lowest Calories": "calories",
    "Highest Calories": "calories",
    "Lowest Fat": "total_fat",
    "Highest Fat": "total_fat",
    "Lowest Protein": "protein",
    "Highest Protein": "protein",
    "Lowest Carbs": "total_carbs",
    "Highest Carbs": "total_carbs",
    "Lowest Sodium": "sodium",
    "Highest Sodium": "sodium",
    "Lowest Sugar": "sugars",
    "Highest Sugar": "sugars",
    "Lowest Fibre": "fibre",
    "Highest Fibre": "fibre",
  };

  const applyFilters = (query: any) => {
    if (filters.calories[0] !== 0 || filters.calories[1] !== 2000) {
      query = query.gte('calories', filters.calories[0]).lte('calories', filters.calories[1]);
    }
    if (filters.fat[0] !== 0 || filters.fat[1] !== 200) {
      query = query.gte('total_fat', filters.fat[0]).lte('total_fat', filters.fat[1]);
    }
    if (filters.protein[0] !== 0 || filters.protein[1] !== 100) {
      query = query.gte('protein', filters.protein[0]).lte('protein', filters.protein[1]);
    }
    if (filters.carbs[0] !== 0 || filters.carbs[1] !== 1000) {
      query = query.gte('total_carbs', filters.carbs[0]).lte('total_carbs', filters.carbs[1]);
    }
    if (filters.sodium[0] !== 0 || filters.sodium[1] !== 5000) {
      query = query.gte('sodium', filters.sodium[0]).lte('sodium', filters.sodium[1]);
    }
    if (filters.sugars[0] !== 0 || filters.sugars[1] !== 200) {
      query = query.gte('sugars', filters.sugars[0]).lte('sugars', filters.sugars[1]);
    }
    if (filters.fibre[0] !== 0 || filters.fibre[1] !== 200) {
      query = query.gte('fibre', filters.fibre[0]).lte('fibre', filters.fibre[1]);
    }

    filters.allergies.forEach((allergy) => {
      if (allergy.checked) {
        if (allergy.key === "food" || allergy.key === "drink") {
          query = query.eq("drink_or_food", capitalize(allergy.key));
        }
        else {
          query = query.eq(allergy.key, true);
        }
      }
    });

    return query;
  };

  const fetchFoodItems = useCallback(
    async (page: number, isNewSearch = false) => {
      setIsLoading(true);
      setError(null);

      try {
        if (!userLocation?.current) {
          throw new Error("User location not available");
        }

        // Fetch restaurant locations with their lat/long
        const { data: locations, error: locError } = await supabase
          .from("locations")
          .select("restaurant_id, company_name,location_id, lat, long");

        if (locError) throw new Error(locError.message);

        // Sort restaurants by distance from the user
        const sortedLocations = locations
          .map((location) => ({
            ...location,
            distance: getDistanceFromLatLonInKm(
              userLocation?.current?.lat,
              userLocation?.current?.long,
              location.lat,
              location.long
            ),
          }))
          .sort((a, b) => a.distance - b.distance); // Sort by distance

        // Filter restaurants within the 10km radius
        const nearbyRestaurants = sortedLocations.filter(
          (location) => location.distance <= 10
        );

        if (nearbyRestaurants.length === 0) {
          setFoodItems([]);
          setHasMore(false);
          setIsLoading(false);
          return;
        }

        // Start building the query
        let query = supabase
          .from("products")
          .select("*")
          .in("rest_id", nearbyRestaurants.map((loc) => loc.restaurant_id));

        if (searchTerm && searchTerm.trim() !== "") {
          query = query.ilike("product_name", `%${searchTerm}%`);
        }


        // Apply filters, including food_or_drink
        query = applyFilters(query);

        // Apply sorting
        if (sortOption !== "Default") {
          const sortKey = sortKeyMap[sortOption];
          if (sortKey) {
            query = query.order(sortKey, {
              ascending: sortOption.startsWith("Lowest"),
              nullsFirst: false,
            });
            query = query.not(sortKey, "is", null); // Exclude items with null sortKey
          }
        }

        // Execute the query
        const { data: products, error: prodError } = await query;

        if (prodError) throw new Error(prodError.message);

        // Map distance and restaurant name to products
        const productsWithDistance = products.map((product: any) => {
          const location: any = sortedLocations.find(
            (loc) => loc.restaurant_id === product.rest_id
          );
          return {
            ...product,
            distance: location?.distance || 0, // Add distance to product
            company_name: location?.company_name || "", // Add restaurant name
            location_id: location?.location_id || ""
          };
        });

        // Sort products by the same order as the sorted restaurant distances
        const sortedProducts = productsWithDistance.sort((a: any, b: any) => {
          const indexA = nearbyRestaurants.findIndex(
            (rest) => rest.restaurant_id === a.rest_id
          );
          const indexB = nearbyRestaurants.findIndex(
            (rest) => rest.restaurant_id === b.rest_id
          );
          return indexA - indexB; // Sort based on the restaurant's order
        });

        // Paginate through sorted products
        const paginatedProducts = sortedProducts.slice(
          (page - 1) * 20,
          page * 20
        );

        setFoodItems((prev) => {
          const newItems = isNewSearch ? paginatedProducts : [...prev, ...paginatedProducts];
          return Array.from(
            new Map(newItems.map((item: any) => [item.prod_id, item])).values()
          );
        });

        setHasMore(sortedProducts.length > page * 20);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, sortOption, searchTerm, userLocation, selectedLocation]
  );


  function getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }


  useEffect(() => {
    setPage(1);
    setFoodItems([]); // Clear food items on new search
    fetchFoodItems(1, true); // Indicate that this is a new search
  }, [filters, sortOption, searchTerm, fetchFoodItems]);

  useEffect(() => {
    if (page > 1) {
      fetchFoodItems(page);
    }
  }, [page, fetchFoodItems]);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && hasMore) {
        setPage((prev) => prev + 1);
      }
    };

    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.disconnect();
      }
    };
  }, [isLoading, hasMore]);

  return (
    <div className="flex flex-col pb-20 justify-start items-start hide-scrollbar h-full w-full gap-4 p-3 md:p-4 overflow-y-scroll">
      {/* <div className="w-full">
        <SearchBarResponsive onSearch={setSearchTerm} />
      </div> */}
      <div className="w-full flex justify-end items-end space-x-2">
        <Sort onSortChange={setSortOption} />
        <ResetFiltersButton />
      </div>

      {error && (
        <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {isLoading && foodItems.length === 0 && (
        <div className="w-full flex flex-col items-center gap-4 justify-center">
          {[...Array(10)].map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      )}

      {!isLoading && foodItems.length === 0 && !error && (
        <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
          <p className="font-medium">No foods for current filters.</p>
          <p>
            We are constantly updating our site with new foods for you to
            browse!
          </p>
        </div>
      )}

      {foodItems.map((item) => (
        <FoodItem
          key={item.prod_id}
          item={item}
          toggleView={toggleView}
          onHighlightLocations={onHighlightLocations}
          proximity={item.distance}
        />
      ))}

      {isLoading && foodItems.length > 0 && (
        <div className="w-full flex justify-center">
          <LoadingCard />
        </div>
      )}

      <div ref={loader}></div>
    </div>
  );
}
