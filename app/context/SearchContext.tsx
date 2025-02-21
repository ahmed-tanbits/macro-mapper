"use client";

import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { debounce } from "lodash";
import { supabase } from "@/supabaseClient";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/**
 * Types
 */
type SuggestionType = "restaurant" | "food" | "location";

type Suggestion = {
    id: string;
    name: string;
    type: SuggestionType;
    proximity?: number;
};

type Coordinates = {
    latitude: number;
    longitude: number;
};

type LocationOption = {
    value: string;
    label: string;
    coordinates?: [number, number];
};

type LoadingState = {
    restaurants: boolean;
    locations: boolean;
};

type SearchContextType = {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    suggestions: Suggestion[];
    setSuggestions: (suggestions: Suggestion[]) => void;
    userLocation: Coordinates | null;
    locations: LocationOption[];
    setLocations: React.Dispatch<React.SetStateAction<LocationOption[]>>;
    selectedLocation: any;
    setSelectedLocation: any;
    fetchSuggestions: (term: string) => void;
    fetchLocations: (query: string) => void;
    selectedSuggestion: string | null;
    setSelectedSuggestion: any;
    loading: LoadingState;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>("");
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
    const [locations, setLocations] = useState<LocationOption[]>([]);

    const [loading, setLoading] = useState<LoadingState>({
        restaurants: false,
        locations: false,
    });

    // Set user's location from cookies if available
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

    // Haversine formula to calculate distance between two coordinates
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
            if (!userLocation) return;

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
                            type: "food",
                            proximity,
                        };
                    })
                );

                const combinedSuggestions: any[] = [
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

    // Get user's current location using geolocation API
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await axios.get(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`
                    );
                    const place = res.data.features[0]?.place_name || "Unknown Location";
                    // console.log("res.data.features[0] =>", res.data.features[0])
                    const currentLocation = {
                        label: place,
                        value: place,
                        coordinates: res.data.features[0]?.geometry?.coordinates
                    }
                    setSelectedLocation(currentLocation);
                } catch (error) {
                    console.error("Error fetching current location:", error);
                }
            },
            (error) => console.error("Geolocation error:", error),
            { enableHighAccuracy: true }
        );
    }, []);

    // Fetch locations from Mapbox API based on search input
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

    return (
        <SearchContext.Provider value={{
            searchTerm,
            setSearchTerm,
            suggestions,
            setSuggestions,
            userLocation,
            selectedLocation,
            setSelectedLocation,
            locations,
            setLocations,
            fetchSuggestions,
            fetchLocations,
            selectedSuggestion,
            setSelectedSuggestion,
            loading
        }}>
            {children}
        </SearchContext.Provider>
    );
};

/**
 * Hook for consuming search context
 */
export const useSearch = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (!context) throw new Error("useSearch must be used within a SearchProvider");
    return context;
};
