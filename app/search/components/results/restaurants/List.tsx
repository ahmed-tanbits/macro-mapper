"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Restaurant from "./Restaurant";
import LoadingCard from "./LoadingCard";
import { supabase } from "@/supabaseClient";
import SearchBar from "./SearchBar";
import Cookies from "js-cookie";

type RestFiltersType = {
  cuisines: string[];
};

type LocationItem = {
  location_id: string;
  restaurant_id: string;
  image_id: string;
  company_name: string;
  description: string;
  cuisine: string;
  google_link: string;
  address: string;
  phone: string;
  website: string;
  lat: number;
  long: number;
  open_mon: string;
  open_tues: string;
  open_wed: string;
  open_thur: string;
  open_fri: string;
  open_sat: string;
  open_sun: string;
  is_active: boolean;
  suburb: string;
  state: string;
  street: string;
  post_code: string;
  google_places_id: string;
  closed: boolean;
};

type Product = {
  prod_id: string;
  rest_id: string;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  is_nut_free: boolean;
  is_shell_fish_free: boolean;
  is_soy_free: boolean;
  is_egg_free: boolean;
  is_sesame_free: boolean;
  is_sulfite_free: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
};

type Props = {
  restFilters: RestFiltersType;
};

export default function List({ restFilters }: Props) {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const loader = useRef<HTMLDivElement | null>(null);
  const cachedIds = useRef<Set<string>>(new Set());
  const cachedProductRestIds = useRef<Set<string>>(new Set());
  const cachedClosestRestaurantIds = useRef<Set<string>>(new Set());
  const userLocation = useRef<{ latitude: number; longitude: number } | null>(
    null
  );

  const MAX_RADIUS_KM = 5; // Set your desired maximum radius in kilometers

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

  const fetchLocations = useCallback(
    async (page: number, searchTerm: string, restFilters: RestFiltersType) => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase.from("locations").select("*");

        if (restFilters.cuisines.length > 0) {
          query = query.in("cuisine", restFilters.cuisines);
        }

        if (searchTerm) {
          const searchTerms = searchTerm.split(" ");
          searchTerms.forEach((term) => {
            query = query.or(
              `company_name.ilike.%${term}%,description.ilike.%${term}%,address.ilike.%${term}%,phone.ilike.%${term}%,website.ilike.%${term}%,suburb.ilike.%${term}%,state.ilike.%${term}%,street.ilike.%${term}%,post_code.ilike.%${term}%`
            );
          });
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        const allLocations = data as LocationItem[];

        let filteredLocations = allLocations;
        if (userLocation.current) {
          filteredLocations = allLocations
            .map((location) => ({
              ...location,
              distance: haversineDistance(
                userLocation.current!.latitude,
                userLocation.current!.longitude,
                location.lat,
                location.long
              ),
            }))
            .filter((location) => location.distance <= MAX_RADIUS_KM)
            .sort((a, b) => a.distance - b.distance);
        }

        const newLocations = filteredLocations.filter(
          (location) => !cachedIds.current.has(location.location_id)
        );

        const paginatedLocations = newLocations.slice(
          (page - 1) * 10,
          page * 10
        );

        if (paginatedLocations.length > 0) {
          setLocations((prev) => [...prev, ...paginatedLocations]);
          paginatedLocations.forEach((location) => {
            cachedIds.current.add(location.location_id);
            cachedClosestRestaurantIds.current.add(location.restaurant_id); // Cache restaurant IDs
          });
          await fetchProducts(paginatedLocations);
        }

        setHasMore(paginatedLocations.length === 10);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchProducts = useCallback(async (locations: LocationItem[]) => {
    const restIds = locations
      .map((loc) => loc.restaurant_id)
      .filter((id) => !cachedProductRestIds.current.has(id));

    if (restIds.length === 0) return;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("rest_id", restIds);

    if (error) {
      setError(error.message);
      console.error("Error fetching products:", error);
    } else {
      const productsByRestId = data.reduce(
        (acc: { [key: string]: Product[] }, product: Product) => {
          if (!acc[product.rest_id]) {
            acc[product.rest_id] = [];
          }
          acc[product.rest_id].push(product);
          return acc;
        },
        {}
      );
      setProducts((prev) => ({ ...prev, ...productsByRestId }));

      restIds.forEach((id) => cachedProductRestIds.current.add(id));
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setLocations([]);
    cachedIds.current.clear();
    cachedProductRestIds.current.clear();
    cachedClosestRestaurantIds.current.clear(); // Clear cached closest restaurant IDs
    fetchLocations(1, searchTerm, restFilters);
  }, [restFilters, searchTerm, fetchLocations]);

  useEffect(() => {
    if (page > 1) {
      fetchLocations(page, searchTerm, restFilters);
    }
  }, [page, fetchLocations, searchTerm, restFilters]);

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
        <SearchBar onSearch={setSearchTerm} />
      </div>
      <div className="w-full flex justify-end items-end">
        {isLoading && page === 1 && <LoadingCard />}
      </div>

      {error && (
        <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {locations.length === 0 && !isLoading && !error && (
        <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
          <p className="font-medium">No restaurants for current filters.</p>
          <p>
            We are constantly updating our site with new restaurants for you to
            browse!
          </p>
        </div>
      )}

      {userLocation.current &&
        locations.map((location, index) => {
          const distance = haversineDistance(
            userLocation.current!.latitude,
            userLocation.current!.longitude,
            location.lat,
            location.long
          );
          const shouldShowLine =
            index !== 0 &&
            Math.floor(distance) >
              Math.floor(
                haversineDistance(
                  userLocation.current!.latitude,
                  userLocation.current!.longitude,
                  locations[index - 1].lat,
                  locations[index - 1].long
                )
              );

          return (
            <React.Fragment key={location.location_id}>
              {shouldShowLine && (
                <div className="w-full text-center border-b border-neutral-200 text-neutral-600 py-2">
                  <p className="text-sm">
                    More than {Math.floor(distance)} km away
                  </p>
                </div>
              )}
              <Restaurant
                {...location}
                products={products[location.restaurant_id]}
                distance={distance}
              />
            </React.Fragment>
          );
        })}

      {isLoading && page > 1 && (
        <div className="w-full flex justify-center">
          <LoadingCard />
        </div>
      )}

      {locations.length >= 0 && !isLoading && !error && (
        <div className="w-full flex flex-col items-center justify-center text-center gap-2 pt-5">
          <p className="font-medium">Results are limited to your 5km radius.</p>
          <p>
            This helps us provide the you with the most relevant nearby options.
          </p>
        </div>
      )}

      <div ref={loader}></div>
    </div>
  );
}
