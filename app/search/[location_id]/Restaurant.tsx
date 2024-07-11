"use client";
import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import Image from "next/image";
import BackLink from "./components/BackLink";
import AllergenTags from "./components/AllergenTags";



type RestaurantProps = {
  location: {
    location_id: string;
    restaurant_id: string;
    image_id: string;
    company_name: string;
    description: string;
    cuisine: string;
    google_link: string;
    address: string;
    phone: string;
    website: string;
    lat: number;
    long: number;
    open_mon: string;
    open_tues: string;
    open_wed: string;
    open_thur: string;
    open_fri: string;
    open_sat: string;
    open_sun: string;
    is_active: boolean;
    suburb: string;
    state: string;
    street: string;
    post_code: string;
    google_places_id: string;
    closed: boolean;
  };
  products: Product[];
};

const Restaurant: React.FC<RestaurantProps> = ({ location, products }) => {
  const [copied, setCopied] = useState(false);

  const address = location.address;
  const handleCopy = () => {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="w-full bg-white flex flex-col md:flex-row items-center justify-start px-4 lg:px-8 pt-8 pb-0 relative">
      <div className="relative w-40 bg-neutral-50 aspect-square flex items-center justify-center rounded-2xl overflow-clip mb-4 md:mb-0 md:mr-5">
        <Image
          src={`https://wsuteglijvwrmcsjhhom.supabase.co/storage/v1/object/public/IMG_LOGOS/${location.image_id}.png`}
          width={160}
          height={160}
          alt="restaurant"
          className="w-full h-auto"
        />
        <div className="absolute inset-0 border border-black/20 rounded-2xl pointer-events-none"></div>
      </div>
      <div className="flex flex-col w-full gap-3">
        <h2 className="text-2xl font-bold text-center md:text-left mb-4 md:mb-0">
          {location.company_name}
        </h2>
        <div
          className="relative group flex items-center cursor-pointer select-none"
          onClick={handleCopy}
        >
          <span className="text-base text-neutral-500 w-fit max-w-64 md:max-w-96 truncate">
            {address}
          </span>
          <span
            className={`ml-1 transition-opacity duration-300 ${
              copied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } opacity-100 md:opacity-0`}
          >
            {!copied && (
              <Copy
                size={16}
                className="text-neutral-500 transition-colors duration-300"
              />
            )}
          </span>
          {copied && (
            <Check
              size={16}
              className="text-green-500 transition-colors duration-300"
            />
          )}
        </div>
        <AllergenTags products={products} />
      </div>
      <div className="absolute top-8 right-8 hidden md:flex flex-col gap-2">
        <BackLink />
      </div>
    </div>
  );
};

export default Restaurant;
