"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import RestaurantsSvg from "@/app/components/svgs/RestaurantsSvg";
import FoodsSvg from "@/app/components/svgs/FoodsSvg";

const Tabs: React.FC = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "foods"; 
  const activeTab = tab === "foods" ? "Foods" : "Restaurants";

  const currentParams = new URLSearchParams(searchParams.toString());
  currentParams.delete("tab");

  const baseUrl = typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <div className="border-b border-[#E8E8E8] border-opacity-50">
      <ul className="flex justify-center text-sm font-medium text-center text-neutral-500 pt-2">
        {/* Restaurants Tab */}
        <li className="mr-2">
          <Link
            href={`${baseUrl}?tab=restaurants&${currentParams.toString()}`}
            className={`inline-flex items-center justify-center py-4 px-5 border-b-2 rounded-t-lg group ${
              activeTab === "Restaurants"
                ? "text-[#0AC600] border-[#0AC600]"
                : "text-[#2D2E2F] border-transparent hover:text-neutral-700 hover:border-neutral-300"
            }`}
          >
            <RestaurantsSvg
              color={activeTab === "Restaurants" ? "#0AC600" : "#2D2E2F"}
              height={22}
              width={22}
            />
            <span className="ml-2">Restaurants</span>
          </Link>
        </li>

        {/* Foods Tab */}
        <li className="mr-2">
          <Link
            href={`${baseUrl}?tab=foods&${currentParams.toString()}`}
            className={`inline-flex items-center justify-center py-4 px-5 border-b-2 rounded-t-lg group ${
              activeTab === "Foods"
                ? "text-[#0AC600] border-[#0AC600]"
                : "text-[#2D2E2F] border-transparent hover:text-neutral-700 hover:border-neutral-300"
            }`}
          >
            <FoodsSvg
              color={activeTab === "Foods" ? "#0AC600" : "#2D2E2F"}
              height={22}
              width={22}
            />
            <span className="ml-2">Foods</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Tabs;
