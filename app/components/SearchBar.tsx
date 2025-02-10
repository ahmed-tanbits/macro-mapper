"use client";
import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { Search, X, Store, Utensils, MapPin, ArrowRight } from "lucide-react";
import { supabase } from "@/supabaseClient";
import LocationButton from "./LocationButton";
import Skeleton from "./Skeleton";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

type Props = {};

type Suggestion = {
  id: string;
  name: string;
  type: "restaurant" | "foods";
  proximity?: number;
};
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const SearchBar: React.FC<Props> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<{
    restaurants: boolean;
    locations: boolean;
  }>({
    restaurants: false,
    locations: false,
  });

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const lat = Cookies.get("latitude");
    const lon = Cookies.get("longitude");

    if (lat && lon) {
      setUserLocation({
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      });
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

  const fetchSuggestions = useCallback(
    debounce(async (term: string) => {
      if (!userLocation) {
        return;
      }

      setLoading((prev) => ({ ...prev, restaurants: true }));
      try {
        const [
          { data: locationData, error: locationError },
          { data: productData, error: productError },
        ] = await Promise.all([
          supabase
            .from("locations")
            .select("location_id, company_name, lat, long, restaurant_id")
            .ilike("company_name", `%${term}%`),
          supabase
            .from("products")
            .select("prod_id, product_name, rest_id")
            .ilike("product_name", `%${term}%`),
        ]);

        if (locationError) throw new Error(locationError.message);
        if (productError) throw new Error(productError.message);

        const locationSuggestions: Suggestion[] = (locationData || []).map(
          (loc: any) => ({
            id: loc.location_id,
            name: loc.company_name,
            type: "restaurant",
            proximity: haversineDistance(
              userLocation.latitude,
              userLocation.longitude,
              loc.lat,
              loc.long
            ),
          })
        );

        const productSuggestionsWithProximity = await Promise.all(
          (productData || []).map(async (prod: any) => {
            const { data: locs, error: locsError } = await supabase
              .from("locations")
              .select("lat, long")
              .eq("restaurant_id", prod.rest_id);
            if (locsError) throw new Error(locsError.message);

            const proximities = (locs || []).map((loc: any) =>
              haversineDistance(
                userLocation.latitude,
                userLocation.longitude,
                loc.lat,
                loc.long
              )
            );
            const proximity = proximities.length
              ? Math.min(...proximities)
              : undefined;
            return {
              id: prod.prod_id,
              name: prod.product_name,
              type: "foods" as "foods",
              proximity,
            };
          })
        );

        const combinedSuggestions: Suggestion[] = [
          ...locationSuggestions,
          ...productSuggestionsWithProximity,
        ];

        combinedSuggestions.sort(
          (a, b) => (a.proximity || Infinity) - (b.proximity || Infinity)
        );

        setSuggestions(combinedSuggestions.slice(0, 5));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading((prev) => ({ ...prev, restaurants: false }));
      }
    }, 500),
    [userLocation]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term.length > 2) {
      fetchSuggestions(term);
    } else {
      setSuggestions([]);
      setSelectedSuggestion(null);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchTerm.length > 2) {
        router.push(
          `/search/map?tab=foods&suggested=${encodeURIComponent(searchTerm)}`
        );
      }
    }
  };

  const navigateToRoute = (event: any) => {
    event.preventDefault();
    router.push(
      `/search/map?tab=foods&suggested=${encodeURIComponent(searchTerm)}`
    );
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedSuggestion(null);
    setSuggestions([]);
  };

  const [location, setLocation] = useState<string>("");
  const [locations, setLocations] = useState<
    { value: string; label: string; coordinates?: [number, number] }[]
  >([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedSuggetion, setSelectedSuggestion] = useState<any>();

  // Get user’s current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
          );
          const place = res.data.features[0]?.place_name || "Unknown Location";
          setSelectedLocation({ value: place, label: place });
          setLocation(place);
        } catch (error) {
          console.error("Error fetching current location:", error);
        }
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  // Fetch locations from Mapbox
  const fetchLocations = useCallback(async (inputValue: string) => {
    if (!inputValue.trim()) return;
    setLoading((prev) => ({ ...prev, locations: true }));

    try {
      const res = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          inputValue
        )}.json?access_token=${MAPBOX_TOKEN}`
      );
      const newLocations = res.data.features.map((place: any) => ({
        value: place.place_name,
        label: place.place_name,
        coordinates: place.geometry?.coordinates,
      }));
      setLocations(newLocations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading((prev) => ({ ...prev, locations: false }));
    }
  }, []);

  // Debounce input changes to reduce API calls
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setLocation(input);

    if (input.length > 2) {
      fetchLocations(input);
    } else {
      setLocations([]);
      setSelectedLocation(null);
    }
  };

  const handleLocationSelect = (location: { value: string; label: string }) => {
    setSelectedLocation(location);
    setLocation(location.label);
    setLocations([]);
  };

  const handleClearLocations = () => {
    setLocation("");
    setLocations([]);
    setSelectedLocation(null);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setSearchTerm(suggestion?.name);
    setSuggestions([]);
  };

  console.log("suggestion =>", selectedSuggetion);

  return (
    <div className="z-[99] w-full">
      <form onSubmit={navigateToRoute}>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mx-auto w-full bg-white rounded-lg shadow-none sm:shadow-md max-w-[600px]">
          <div className="flex relative max-w-xl mx-auto w-full shadow-md sm:shadow-none rounded-lg sm:rounded-none">
            <div
              className="bg-transparent overflow-hidden px-4 py-2 relative w-full flex items-center justify-between rounded-sm"
              style={{ transition: "box-shadow 0.3s ease-in-out" }}
            >
              <div className="ml-2 flex w-full justify-center items-center gap-2 lg:gap-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full h-full bg-transparent outline-none text-sm py-2 1200:py-0"
                  placeholder="Search by location or food..."
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
              {
                searchTerm && (
                  <button
                    onClick={handleClear}
                    className="bg-yellow-500 p-1 z-20 bg-opacity-20 hover:bg-opacity-30 transition-all mr-1 aspect-square select-none cursor-pointer rounded-full flex items-center justify-center text-yellow-600 lg:mr-1"
                  >
                    <X className="w-3 h-3 lg:w-4 lg:h-4" strokeWidth={3} />
                  </button>
                )
                // : (
                //   <LocationButton />
                // )
              }
            </div>
            {loading.restaurants && (
              <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 lg:top-14">
                <Skeleton />
              </div>
            )}

            {!loading.restaurants && suggestions.length > 0 && (
              <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 p-2 lg:top-14 lg:p-3">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="relative overflow-x-auto flex items-center justify-between gap-2 py-2 px-3 hover:bg-neutral-50 border border-transparent hover:border-neutral-100 rounded-full transition-all cursor-pointer select-none group hover:pr-6 text-sm lg:py-3 lg:px-4 lg:text-base lg:hover:pr-8"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <div className="flex items-center gap-2 lg:gap-3 shrink-0">
                      {suggestion.type === "restaurant" ? (
                        <Store className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      ) : (
                        <Utensils className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      )}
                      <span className="text-sm">{suggestion.name}</span>
                    </div>
                    {suggestion.proximity !== undefined && (
                      <span className="text-xs text-neutral-500 transition-all flex whitespace-nowrap gap-1 items-center lg:text-sm">
                        <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4" />{" "}
                        {suggestion.proximity.toFixed(1)} km
                      </span>
                    )}
                    {/* <ArrowRight
                      strokeWidth={1.8}
                      className="w-4 h-4 lg:w-5 lg:h-5 absolute right-2 bg-white rounded-full transition-transform transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300 text-neutral-600"
                    /> */}
                  </div>
                ))}
              </div>
            )}

            {!loading.restaurants &&
              searchTerm.length > 2 &&
              !selectedSuggetion &&
              suggestions.length === 0 && (
                <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 p-2 text-center text-sm lg:top-14 lg:text-base">
                  <p>No results found.</p>
                </div>
              )}
          </div>

          <div className="flex relative max-w-xl mx-auto w-full shadow-md sm:shadow-none rounded-lg sm:rounded-none">
            <div className="flex relative max-w-xl mx-auto w-full sm:before:content-[''] sm:before:h-1/2 sm:before:absolute sm:before:bg-gray-100 sm:before:w-[2px] sm:before:top-1/2 sm:before:-translate-y-1/2 sm:before:left-0">
              <div
                className="bg-transparent overflow-hidden px-4 py-2 relative w-full flex items-center justify-between"
                style={{ transition: "box-shadow 0.3s ease-in-out" }}
              >
                <div className="ml-2 w-full flex justify-center items-center gap-2 lg:gap-3">
                  <input
                    type="text"
                    value={location}
                    onChange={handleLocationChange}
                    // onKeyPress={handleKeyPress}
                    className="w-full h-full bg-transparent outline-none text-sm py-2 1200:py-0"
                    placeholder="Search by location or food..."
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>
                {location && (
                  <button
                    onClick={handleClearLocations}
                    className="bg-yellow-500 z-20 p-1 bg-opacity-20 hover:bg-opacity-30 transition-all mr-1 aspect-square select-none cursor-pointer rounded-full flex items-center justify-center text-yellow-600 lg:mr-1"
                  >
                    <X className="w-3 h-3 lg:w-4 lg:h-4" strokeWidth={3} />
                  </button>
                )}
              </div>

              {loading.locations && (
                <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 lg:top-14">
                  <Skeleton />
                </div>
              )}

              {!loading.locations && locations.length > 0 && (
                <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 p-2 lg:top-14 lg:p-3">
                  {locations.map((location: any) => (
                    <div
                      className="flex hover:bg-neutral-50 rounded-full items-center gap-2 lg:gap-3 py-3 px-3 cursor-pointer text-sm"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
                      {location.label}
                    </div>
                  ))}
                </div>
              )}

              {!loading.locations &&
                location.length > 2 &&
                !selectedLocation &&
                locations.length === 0 && (
                  <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 p-2 text-center text-sm lg:top-14 lg:text-base">
                    <p>No results found.</p>
                  </div>
                )}
            </div>

            <button
              disabled={!selectedLocation}
              type="submit"
              className={`px-3 py-3 rounded-r-md flex items-center justify-center ${
                !selectedLocation
                  ? " cursor-not-allowed bg-gray-300"
                  : "bg-primary-600 hover:bg-primary-700"
              }`}
            >
              <Search className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
