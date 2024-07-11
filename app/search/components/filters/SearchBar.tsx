"use client";
import Link from "next/link";
import React, { useState } from "react";

type Props = {};

const SearchBar: React.FC<Props> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    // Simulate loading suggestions (you might want to fetch these from an API)
    setSuggestions(["Suggestion 1", "Suggestion 2", "Suggestion 3"]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div
      className="bg-white border overflow-hidden border-neutral-100 p-1.5 relative max-w-sm w-full flex items-center justify-between rounded-full ring-primary-500 focus-within:ring-1  transition-all"
      style={{ transition: "box-shadow 0.3s ease-in-out" }}
    >
      <div className="flex justify-center items-center gap-3">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={handleFocus}
          className="w-full h-full absolute z-10 right-0 pl-4 bg-transparent outline-none"
          placeholder="Search by location or food..."
        />
      </div>
      <Link
        href={"/search/map"}
        className=" bg-primary-500 z-20 hover:bg-primary-600 h-8 aspect-square select-none cursor-pointer rounded-full flex items-center justify-center text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </Link>
    </div>
  );
};

export default SearchBar;
