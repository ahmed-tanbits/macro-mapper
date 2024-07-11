import { ArrowUpRight, Clock9, Tag } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  cuisine: string;
  openingHoursToday: string;
  googlePlacesId: string;
};

export default function Info({
  cuisine,
  openingHoursToday,
  googlePlacesId,
}: Props) {
  return (
    <div className="w-full p-4 px-4 md:px-8 border-b border-t mt-4 border-neutral-100 transition-all duration-300">
      <div className="flex flex-wrap items-center justify-start gap-4 lg:gap-6">
        <span className="py-2 flex gap-2 items-center justify-start whitespace-nowrap text-neutral-800">
          <Tag strokeWidth={1.5} size={20} />
          {cuisine}
        </span>
        <span className="py-2 flex gap-2 items-center justify-start pl-2 whitespace-nowrap">
          <Clock9 strokeWidth={1.5} size={20} />
          Today: <span className=" font-medium">{openingHoursToday}</span>
        </span>
        <Link
          target="_blank"
          href={`https://maps.google.com/?q=place_id:${googlePlacesId}`}
          className="relative flex items-center py-1.5 px-4 bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 transition-all cursor-pointer select-none rounded-full whitespace-nowrap group hover:pr-8"
        >
          <span className="transition-all">Directions</span>
          <ArrowUpRight
            size={18}
            strokeWidth={1.8}
            className="absolute right-2 mr-1 transition-transform transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300"
          />
        </Link>
      </div>
    </div>
  );
}
