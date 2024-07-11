import { ArrowRight, ArrowUpRight, ChevronRight, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TooltipProps {
  company_name: string;
  image_id: string;
  location_id: string;
  isLoading: boolean;
  google_places_id: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  company_name,
  image_id,
  location_id,
  isLoading,
  google_places_id,
}) => {
  if (isLoading) {
    return (
      <>
        <div className="bg-white rounded-lg flex gap-2 items-start justify-start">
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <Image
              src={`/placeholder.png`}
              width={80}
              height={80}
              alt={"placeholder"}
              className="object-cover rounded-xl"
            />
            <div className="absolute inset-0 border border-black/10 rounded-xl pointer-events-none"></div>
          </div>
          <div className="flex flex-col">
            <div className="w-32 h-4 bg-neutral-200 animate-pulse mb-2 rounded-md"></div>
            <div className="w-20 h-4 bg-neutral-200 animate-pulse mb-2 rounded-md"></div>
          </div>
          <div className=" bg-neutral-200 animate-pulse border border-transparent transition-all text-neutral-400 flex items-center justify-center rounded-full w-7 h-7 aspect-square absolute bottom-2 right-2">
            <ChevronRight size={14} strokeWidth={3} />
          </div>
          <div className="  bg-neutral-200 animate-pulse border border-neutral-200 transition-all text-neutral-400 flex items-center justify-center rounded-full w-7 h-7 aspect-square absolute bottom-2 right-10">
            <ArrowUpRight size={14} strokeWidth={3} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
        <Image
          src={`https://wsuteglijvwrmcsjhhom.supabase.co/storage/v1/object/public/IMG_LOGOS/${image_id}.png`}
          width={80}
          height={80}
          alt={company_name}
          className="object-cover rounded-xl"
        />
        <div className="absolute inset-0 border border-black/10 rounded-xl pointer-events-none"></div>
      </div>

      <h3 className="text-sm font-medium text-start">{company_name}</h3>

      <Link
        href={`/search/${location_id}`}
        target="_blank"
        className=" bg-primary-500 hover:bg-primary-600 border border-transparent transition-all text-white flex items-center justify-center rounded-full w-7 h-7 aspect-square absolute bottom-2 right-2"
      >
        <ChevronRight size={14} strokeWidth={3} />
      </Link>
      <Link
        target="_blank"
        href={`https://maps.google.com/?q=place_id:${google_places_id}`}
        className="  hover:bg-neutral-100 border border-neutral-200 transition-all text-neutral-600 flex items-center justify-center rounded-full w-7 h-7 aspect-square absolute bottom-2 right-10"
      >
        <ArrowUpRight size={14} strokeWidth={3} />
      </Link>
    </>
  );
};

export default Tooltip;
