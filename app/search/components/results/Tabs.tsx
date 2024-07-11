"use client";
import { ChefHat, UtensilsCrossed } from "lucide-react";
import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const Tabs: React.FC = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "foods";
  const activeTab = tab.includes("foods") ? "Foods" : "Restaurants";

  const currentParams = new URLSearchParams(searchParams.toString());
  currentParams.delete("tab");

  const baseUrl = window.location.pathname;

  return (
    <div className="border-b border-neutral-200 border-opacity-50">
      <ul className="flex justify-center -mb-px text-sm font-medium text-center text-neutral-500">
        <li className="mr-2">
          <Link
            href={`${baseUrl}?tab=restaurants&${currentParams.toString()}`}
            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
              activeTab === "Restaurants"
                ? "text-neutral-900 border-black"
                : "border-transparent hover:text-neutral-600 hover:border-neutral-300"
            }`}
          >
            <ChefHat
              className={`w-5 h-5 mr-2 ${
                activeTab === "Restaurants"
                  ? "text-black"
                  : "text-neutral-400 group-hover:text-neutral-500"
              }`}
            />
            Restaurants
          </Link>
        </li>
        <li className="mr-2">
          <Link
            href={`${baseUrl}?tab=foods&${currentParams.toString()}`}
            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${
              activeTab === "Foods"
                ? "text-neutral-900 border-black"
                : "border-transparent hover:text-neutral-600 hover:border-neutral-300"
            }`}
          >
            <UtensilsCrossed
              className={`w-5 h-5 mr-2 ${
                activeTab === "Foods"
                  ? "text-black"
                  : "text-neutral-400 group-hover:text-neutral-500"
              }`}
            />
            Foods
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Tabs;
