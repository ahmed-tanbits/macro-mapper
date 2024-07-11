import LoadingCard from "@/app/search/components/results/restaurants/LoadingCard";
import React from "react";


export default function LoadingMenu() {
  return (
    <div className="px-4 md:px-8 animate-pulse pt-4">
      <div className="flex justify-start space-x-4 overflow-x-auto hide-scrollbar mb-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-10 w-24 bg-neutral-200 rounded-full"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    </div>
  );
}
