import React from "react";

export default function LoadingInfo() {
  return (
    <div className="w-full p-4 px-4 md:px-8 border-b border-t mt-4 border-neutral-100 animate-pulse">
      <div className="flex flex-wrap items-center justify-start gap-4 lg:gap-6">
        <span className="py-2 flex gap-2 items-center justify-start whitespace-nowrap text-neutral-800">
          <div className="h-6 w-24 bg-neutral-200 rounded-md"></div>
        </span>
        <span className="py-2 flex gap-2 items-center justify-start pl-2 whitespace-nowrap">
          <div className="h-6 w-24 bg-neutral-200 rounded-md"></div>
        </span>
        <div className="relative flex items-center py-1.5 px-4 bg-neutral-300 text-neutral-300 transition-all select-none rounded-full">
          <div className="h-6 w-24 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
