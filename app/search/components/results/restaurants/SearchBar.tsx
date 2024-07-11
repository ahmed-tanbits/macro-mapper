"use client";
import { debounce } from "lodash";
import { Search, X } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Props = {
  onSearch: (searchTerm: string) => void;
};

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const suggested = searchParams.get("suggested");

    if (suggested) {
      setSearchTerm(suggested);
      onSearch(suggested);

      // Remove the 'suggested' parameter from the URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("suggested");

      router.replace(
        `${window.location.pathname}?${params.toString()}`,
        undefined
      );
    }
  }, [searchParams, onSearch, router]);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, 500),
    [onSearch]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchTerm.length > 2) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", "restaurant");
        params.set("suggested", searchTerm);
        router.push(`/search/map?${params.toString()}`);
      }
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div
      className="bg-white border overflow-hidden border-neutral-100 p-2 relative mx-auto w-full flex items-center justify-between shadow-lg rounded-full ring-primary-500 focus-within:ring-2 transition-all"
      style={{ transition: "box-shadow 0.3s ease-in-out" }}
    >
      <div className="flex justify-center items-center gap-3">
        <div className="z-20 transition-all h-8 aspect-square select-none rounded-full flex items-center justify-center text-neutral-700">
          <Search size={18} />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="w-full h-full absolute z-10 right-0 pl-10 pr-14 bg-transparent outline-none"
          placeholder="Search your favourite restaurants ..."
        />
      </div>
      {searchTerm && (
        <button
          onClick={handleClear}
          className="bg-yellow-500 z-20 bg-opacity-20 hover:bg-opacity-30 transition-all h-8 aspect-square select-none cursor-pointer rounded-full flex items-center justify-center text-yellow-600"
        >
          <X size={18} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
