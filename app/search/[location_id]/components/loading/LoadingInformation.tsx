import React from "react";

export default function LoadingInformation() {
  return (
    <div className="w-full bg-white flex items-start justify-center px-4 lg:px-8 pt-8 pb-0 relative animate-pulse">
      <div className="pb-20 max-w-sm pr-5 lg:pr-10">
        <div className="h-4 w-64 bg-neutral-200 rounded-md mb-4"></div>
        <div className="h-4 w-64 bg-neutral-200 rounded-md"></div>
      </div>
      <div className="border-l border-r border-neutral-200 pb-20 max-w-sm px-5 lg:px-10">
        <h2 className="text-xl font-bold mb-4">
          <div className="h-6 w-32 bg-neutral-200 rounded-md"></div>
        </h2>
        <div className="text-sm text-neutral-500">
          <div className="h-4 w-48 bg-neutral-200 rounded-md"></div>
        </div>
      </div>
      <div className="pl-5 lg:pl-10 w-full max-w-md">
        {[...Array(7)].map((_, index) => (
          <div key={index} className="h-4 w-48 bg-neutral-200 rounded-md mb-2"></div>
        ))}
      </div>
    </div>
  );
}
