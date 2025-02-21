import {
  ArrowUpRight,
  ChevronRight,
  Clock9,
  Crosshair,
  Crown,
  MapPin,
  Tag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import BadgeList from "./BadgeList";
import { useAuth } from "@/app/context/AuthContext";

export interface RestaurantProps {
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
  products?: Product[];
  distance: number;
}

export default function Restaurant({
  company_name,
  cuisine,
  address,
  google_link,
  open_mon,
  open_tues,
  open_wed,
  open_thur,
  open_fri,
  open_sat,
  open_sun,
  image_id,
  is_active,
  closed,
  products,
  location_id,
  google_places_id,
  distance,
}: RestaurantProps) {
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const openingHours: { [key: string]: string } = {
    monday: open_mon,
    tuesday: open_tues,
    wednesday: open_wed,
    thursday: open_thur,
    friday: open_fri,
    saturday: open_sat,
    sunday: open_sun,
  };
  const { user } = useAuth();

  const proximity =
    distance < 1
      ? `${(distance * 1000).toFixed(0)}m`
      : `${distance.toFixed(1)}km`;

  return (
    <div className="w-full rounded-xl shadow-md bg-white border-neutral-100 transition-all">
      <div className="flex items-start justify-between w-full p-4">
        <div className="flex items-start justify-start flex-col gap-4">
          <h2 className="text-lg font-semibold text-wrap pr-2">
            {company_name}
          </h2>
          <div className="flex items-start justify-start flex-col text-neutral-500 font-normal gap-1">
            {cuisine && (
              <RestaurantDetail icon={<Tag size={14} />} detail={cuisine} />
            )}
            {address && (
              <RestaurantDetail icon={<MapPin size={14} />} detail={address} />
            )}
            <RestaurantDetail
              icon={<Clock9 size={14} />}
              detail={openingHours[today]}
            />
            <span
              className={`text-sm flex justify-start items-center gap-1 ${distance < 1 ? "text-primary-600" : "text-neutral-500"
                }`}
            >
              <Crosshair size={14} />
              <div className="w-full max-w-40 xl:max-w-60 truncate">
                {proximity} away
              </div>
            </span>
          </div>
          <div className="w-full">
            {user?.hasSubscription ?
              <div className="flex gap-2 justify-start items-center">
                <BadgeList products={products} />
              </div>
              :
              <Link
                href="/auth/upgrade-to-premium"
                className="flex items-center font-bold rounded-full justify-center gap-1 w-full text-black border border-yellow-main bg-yellow-main hover:bg-yellow-400 transition text-sm py-3 text-center"
              >
                <span>Unlock More With Premium</span>
                <span>
                  <Crown size={20} fill="#000" />
                </span>
              </Link>
            }
          </div>
        </div>
        <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <Image
            src={`https://wsuteglijvwrmcsjhhom.supabase.co/storage/v1/object/public/IMG_LOGOS/${image_id}.png`}
            width={80}
            height={80}
            alt="Restaurant"
            className="object-cover rounded-xl"
          />
          <div className="absolute inset-0 border border-black/10 rounded-xl pointer-events-none"></div>
        </div>
      </div>
      <div className="flex gap-2 justify-start items-center bg-neutral-50 px-3 pb-3 pt-3 border-t border-neutral-100 rounded-b-xl">
        <Link
          href={`/search/${location_id}`}
          className="relative flex items-center py-1.5 px-4 bg-primary-500 transition-all cursor-pointer select-none text-white rounded-full group hover:pr-8"
        >
          <span className="transition-all">Menu</span>
          <ChevronRight
            strokeWidth={1.8}
            size={20}
            className="absolute right-2 transition-transform transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300"
          />
        </Link>
        {google_places_id && (
          <Link
            target="_blank"
            href={`https://www.google.com/maps/place/?q=place_id:${google_places_id}`}
            className="relative flex items-center py-1.5 px-4 bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 transition-all cursor-pointer select-none rounded-full group hover:pr-8"
          >
            <span className="transition-all">Directions</span>
            <ArrowUpRight
              size={18}
              strokeWidth={1.8}
              className="absolute right-2 mr-1 transition-transform transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300"
            />
          </Link>
        )}
      </div>
    </div>
  );
}

function RestaurantDetail({
  icon,
  detail,
}: {
  icon: React.ReactNode;
  detail: string;
}) {
  return (
    <span className="text-sm flex justify-start items-center gap-1">
      {icon}
      <div className="w-full max-w-40 xl:max-w-60 truncate">{detail}</div>
    </span>
  );
}
