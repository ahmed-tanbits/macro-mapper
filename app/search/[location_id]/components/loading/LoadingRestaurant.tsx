import React from "react";


export default function LoadingRestaurant() {
  return (
    <div className="w-full bg-white flex flex-col md:flex-row items-center justify-start px-4 lg:px-8 pt-8 pb-0 relative animate-pulse">
      <div className="relative w-40 bg-neutral-50 aspect-square flex items-center justify-center rounded-2xl overflow-clip mb-4 md:mb-0 md:mr-5">
        <div className="w-full h-full bg-neutral-200 rounded-xl"></div>
      </div>
      <div className="flex flex-col w-full gap-3">
        <div className="h-6 w-48 bg-neutral-200 rounded-md"></div>
        <div className="flex flex-col gap-2">
          <div className="h-4 w-64 bg-neutral-200 rounded-md"></div>
          <div className="h-4 w-64 bg-neutral-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
