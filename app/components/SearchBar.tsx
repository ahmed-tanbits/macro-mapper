"use client";
import React, { useEffect, useState } from "react";
import { Search, X, Store, Utensils, MapPin } from "lucide-react";
import Skeleton from "./Skeleton";
import { useRouter } from "next/navigation";
import { useSearch } from "../context/SearchContext";

type Props = {};

type SuggestionType = "restaurant" | "food" | "location";

type Suggestion = {
  id: string;
  name: string;
  type: SuggestionType;
  proximity?: number;
};

type LocationOption = {
  value: string;
  label: string;
  coordinates?: [number, number];
};

const SearchBar: React.FC<Props> = () => {
  const {
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
  } = useSearch();

  const router = useRouter();
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    if (selectedLocation) {
      setLocation(selectedLocation?.value || selectedLocation)
    }
  }, [selectedLocation])

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        router.push(`/search/map?tab=foods&suggested=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const handleSearchNavigation = (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/search/map?tab=foods&suggested=${encodeURIComponent(searchTerm)}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedSuggestion(null);
    setSuggestions([]);
  };

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

  const handleLocationSelect = (location: LocationOption) => {
    setSelectedLocation(location);
    setLocation(location.label);
    setLocations([]);
  };

  const handleClearLocation = () => {
    setLocation("");
    setLocations([]);
    setSelectedLocation(null);
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setSearchTerm(suggestion?.name);
    setSuggestions([]);
  };

  return (
    <div className="z-[99] w-full">
      <form onSubmit={handleSearchNavigation}>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mx-auto w-full bg-white rounded-lg shadow-none sm:shadow-md max-w-[600px]">
          {/* Search Input */}
          <div className="flex relative max-w-xl mx-auto w-full shadow-md sm:shadow-none rounded-lg sm:rounded-none">
            <div className="bg-transparent overflow-hidden px-4 py-2 relative w-full flex items-center justify-between rounded-sm">
              <div className="ml-2 flex w-full justify-center items-center gap-2 lg:gap-3">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  onKeyPress={handleKeyPress}
                  className="w-full h-full bg-transparent outline-none text-sm py-2 1200:py-0"
                  placeholder="Search foods or restaurants..."
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="bg-yellow-500 p-1 z-10 bg-opacity-20 hover:bg-opacity-30 transition-all mr-1 aspect-square select-none cursor-pointer rounded-full flex items-center justify-center text-yellow-600 lg:mr-1"
                >
                  <X className="w-3 h-3 lg:w-4 lg:h-4" strokeWidth={3} />
                </button>
              )}
            </div>

            {/* Suggestions */}
            {loading.restaurants && (
              <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 lg:top-14 z-10">
                <Skeleton />
              </div>
            )}

            {!loading.restaurants && suggestions.length > 0 && (
              <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 p-2 lg:top-14 lg:p-3 z-10">
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
                  </div>
                ))}
              </div>
            )}

            {!loading.restaurants && searchTerm.length > 2 && !selectedSuggestion && suggestions.length === 0 && (
              <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 p-2 text-center text-sm lg:top-14 lg:text-base z-10">
                <p>No results found.</p>
              </div>
            )}
          </div>

          {/* Location Input */}
          <div className="flex relative max-w-xl mx-auto w-full shadow-md sm:shadow-none rounded-lg sm:rounded-none">
            <div className="flex relative max-w-xl mx-auto w-full sm:before:content-[''] sm:before:h-1/2 sm:before:absolute sm:before:bg-gray-100 sm:before:w-[2px] sm:before:top-1/2 sm:before:-translate-y-1/2 sm:before:left-0">
              <div className="bg-transparent overflow-hidden px-4 py-2 relative w-full flex items-center justify-between">
                <div className="ml-2 w-full flex justify-center items-center gap-2 lg:gap-3">
                  <input
                    type="text"
                    value={location}
                    onChange={handleLocationChange}
                    className="w-full h-full bg-transparent outline-none text-sm py-2 1200:py-0"
                    placeholder="Enter your location"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>
                {location && (
                  <button
                    onClick={handleClearLocation}
                    className="bg-yellow-500 z-[9] p-1 bg-opacity-20 hover:bg-opacity-30 transition-all mr-1 aspect-square select-none cursor-pointer rounded-full flex items-center justify-center text-yellow-600 lg:mr-1"
                  >
                    <X className="w-3 h-3 lg:w-4 lg:h-4" strokeWidth={3} />
                  </button>
                )}
              </div>

              {/* Location Suggestions */}
              {loading.locations && (
                <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 lg:top-14 z-10">
                  <Skeleton />
                </div>
              )}

              {!loading.locations && locations.length > 0 && (
                <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 p-2 lg:top-14 lg:p-3 z-10">
                  {locations.map((location: LocationOption) => (
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

              {!loading.locations && location.length > 2 && !selectedLocation && locations.length === 0 && (
                <div className="absolute top-10 w-full bg-white shadow-lg rounded-xl border border-neutral-100 p-2 text-center text-sm lg:top-14 lg:text-base z-10">
                  <p>No results found.</p>
                </div>
              )}
            </div>

            <button
              disabled={!selectedLocation}
              type="submit"
              className={`px-3 py-3 rounded-r-md flex items-center justify-center ${!selectedLocation ? " cursor-not-allowed bg-gray-300" : "bg-primary-600 hover:bg-primary-700"
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
