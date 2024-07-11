import React from "react";
import {
  ArrowUpRight,
  ChevronRight,
  Clock9,
  MapPin,
  MilkOff,
  Tag,
  WheatOff,
} from "lucide-react";

import Link from "next/link";

export default function LoadingCard() {
  return (
    <div className="bg-white w-full shadow-sm rounded-xl border border-neutral-200 animate-pulse">
      <div className="flex items-start justify-between w-full p-4">
        <div className="flex items-start justify-start flex-col gap-4">
          <div className="h-5 w-32 bg-neutral-200 rounded-md"></div>
          <div className="flex items-start justify-start flex-col text-neutral-500 font-normal gap-1">
            <LoadingDetail />
            <LoadingDetail />
            <LoadingDetail />
          </div>
          <div className="w-full">
            <div className="flex gap-2 justify-start items-center">
              <BadgePlaceholder />
              <BadgePlaceholder />
            </div>
          </div>
        </div>
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <div className="w-full h-full bg-neutral-200 rounded-xl"></div>

        </div>
      </div>
      <div className="flex gap-2 justify-start items-center bg-neutral-50 px-3 pb-3 pt-3 border-t border-neutral-100 rounded-b-xl">
        <div

          className="relative flex items-center py-1.5 px-4 bg-neutral-300 text-neutral-300 transition-all select-none rounded-full"
        >
          <span className="transition-all">Menu</span>
          
        </div>
        <div

          className="relative flex items-center py-1.5 px-4 bg-neutral-300 text-neutral-300 transition-all select-none rounded-full"
        >
          <span className="transition-all">Directions</span>
         
        </div>
      </div>
    </div>
  );
}

function LoadingDetail() {
  return (
    <span className="text-sm flex justify-start items-start gap-1">
      <div className="h-4 w-4 bg-neutral-200 rounded-full"></div>
      <div className="h-4 w-24 bg-neutral-200 rounded-md"></div>
    </span>
  );
}

function BadgePlaceholder() {
  return (
    <span className="text-xs text-neutral-700 bg-neutral-500 bg-opacity-15 shadow-sm border border-neutral-300 border-opacity-20 px-2 py-1 rounded-full flex gap-1 items-center justify-center">
      <div className="h-4 w-4 bg-neutral-200 rounded-full"></div>
      <div className="h-4 w-12 bg-neutral-200 rounded-md"></div>
    </span>
  );
}
