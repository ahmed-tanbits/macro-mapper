"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import FoodItem from "./FoodItem";
import { supabase } from "@/supabaseClient";
import LoadingCard from "../restaurants/LoadingCard";
import Sort from "../../filters/Sort";
import SearchBarResponsive from "@/app/search/components/filters/filters-responsive/SearchBarResponsive";
import ResetFiltersButton from "./ResetFiltersButton"; // Import the ResetFiltersButton

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

type RestaurantCacheType = {
  [key: string]: string;
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [proximityData, setProximityData] = useState<{ [key: string]: number }>(
    {}
  );
  const [restaurantCache, setRestaurantCache] = useState<RestaurantCacheType>(
    {}
  );
  const loader = useRef<HTMLDivElement | null>(null);

  const userLocation = useRef<{ latitude: number; longitude: number } | null>(
    null
  );

  const MAX_RADIUS_KM = 5;

  useEffect(() => {
    const lat = Cookies.get("latitude");
    const lon = Cookies.get("longitude");

    if (lat && lon) {
      userLocation.current = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      };
    }
  }, []);

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const fetchClosestRestaurantIds = useCallback(async () => {
    if (!userLocation.current) return [];

    const { latitude, longitude } = userLocation.current;
    const { data, error } = await supabase.from("locations").select("restaurant_id, lat, long");

    if (error) {
      setError(error.message);
      console.error("Error fetching closest restaurant IDs:", error);
      return [];
    }

    const closestRestaurants = data
      .map((location: any) => ({
        ...location,
        distance: haversineDistance(latitude, longitude, location.lat, location.long),
      }))
      .filter((location: any) => location.distance <= MAX_RADIUS_KM)
      .map((location: any) => location.restaurant_id);

    return closestRestaurants;
  }, []);

  const fetchProximityData = useCallback(async (restIds: string[]) => {
    if (!userLocation.current) return;

    const { latitude, longitude } = userLocation.current;
    const { data, error } = await supabase
      .from("locations")
      .select("restaurant_id, lat, long")
      .in("restaurant_id", restIds);

    if (error) {
      setError(error.message);
      console.error("Error fetching proximity data:", error);
      return;
    }

    const proximityMap: { [key: string]: number } = {};
    data.forEach((location: any) => {
      const distance = haversineDistance(
        latitude,
        longitude,
        location.lat,
        location.long
      );
      if (
        !proximityMap[location.restaurant_id] ||
        distance < proximityMap[location.restaurant_id]
      ) {
        proximityMap[location.restaurant_id] = distance;
      }
    });

    setProximityData((prev) => ({ ...prev, ...proximityMap }));
  }, []);

  const fetchRestaurantNames = useCallback(
    async (restIds: string[]) => {
      const uncachedRestIds = restIds.filter((id) => !restaurantCache[id]);
      if (uncachedRestIds.length === 0) return;

      const { data, error } = await supabase
        .from("restaurants")
        .select("rest_id, name")
        .in("rest_id", uncachedRestIds);

      if (error) {
        setError(error.message);
        console.error("Error fetching restaurant names:", error);
        return;
      }

      const newCache: RestaurantCacheType = {};
      data.forEach((restaurant: any) => {
        newCache[restaurant.rest_id] = restaurant.name;
      });

      setRestaurantCache((prev) => ({ ...prev, ...newCache }));
    },
    [restaurantCache]
  );

  const fetchFoodItems = useCallback(
    async (page: number, isNewSearch = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const closestRestaurantIds = await fetchClosestRestaurantIds();

        let query = supabase
          .from("products")
          .select("*")
          .in("rest_id", closestRestaurantIds);

        const startIndex = (page - 1) * 10;
        const endIndex = page * 10 - 1;

        query = query.range(startIndex, endIndex);

        query = applyFilters(query);

        if (searchTerm) {
          query = query.ilike("product_name", `%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        setFoodItems((prev) => (isNewSearch ? data : [...prev, ...data]));

        const restIds = data.map((item: MenuItem) => item.rest_id);
        await fetchProximityData(restIds);
        await fetchRestaurantNames(restIds);

        setHasMore(data.length === 10);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, sortOption, searchTerm, fetchProximityData, fetchRestaurantNames, fetchClosestRestaurantIds]
  );

  function applyFilters(query: any) {
    query = query
      .or(`calories.gte.${filters.calories[0]},calories.is.null`)
      .or(`calories.lte.${filters.calories[1]},calories.is.null`)
      .or(`total_fat.gte.${filters.fat[0]},total_fat.is.null`)
      .or(`total_fat.lte.${filters.fat[1]},total_fat.is.null`)
      .or(`protein.gte.${filters.protein[0]},protein.is.null`)
      .or(`protein.lte.${filters.protein[1]},protein.is.null`)
      .or(`total_carbs.gte.${filters.carbs[0]},total_carbs.is.null`)
      .or(`total_carbs.lte.${filters.carbs[1]},total_carbs.is.null`)
      .or(`sodium.gte.${filters.sodium[0]},sodium.is.null`)
      .or(`sodium.lte.${filters.sodium[1]},sodium.is.null`)
      .or(`sugars.gte.${filters.sugars[0]},sugars.is.null`)
      .or(`sugars.lte.${filters.sugars[1]},sugars.is.null`)
      .or(`fibre.gte.${filters.fibre[0]},fibre.is.null`)
      .or(`fibre.lte.${filters.fibre[1]},fibre.is.null`);

    filters.allergies.forEach((allergy) => {
      if (allergy.checked) {
        query = query.eq(allergy.key, true);
      }
    });

    if (sortOption !== "Default") {
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

      const sortKey = sortKeyMap[sortOption];
      if (sortKey) {
        query = query.order(sortKey, {
          ascending: sortOption.startsWith("Lowest"),
        });
      }
    }

    return query;
  }

  useEffect(() => {
    setPage(1);
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
      threshold: 0,
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
      <div className="w-full">
        <SearchBarResponsive onSearch={setSearchTerm} />
      </div>
      <div className="w-full flex justify-end items-end space-x-2">
        <Sort onSortChange={setSortOption} />
        <ResetFiltersButton /> {/* Add the ResetFiltersButton here */}
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
          proximity={proximityData[item.rest_id]}
          restaurantName={restaurantCache[item.rest_id]}
          onHighlightLocations={onHighlightLocations}
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
