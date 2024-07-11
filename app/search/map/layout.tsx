"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { MapPinOff } from "lucide-react";
import LocationBadge from "@/app/LocationBadge";

export default function Layout({ children }: { children: any }) {
  const [locationAllowed, setLocationAllowed] = useState<boolean>(false);

  useEffect(() => {
    const lat = Cookies.get("latitude");
    const lon = Cookies.get("longitude");

    if (lat && lon) {
      setLocationAllowed(true);
    }
  }, []);

  if (!locationAllowed) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 text-center">
        <MapPinOff size={96} strokeWidth={1.2} className="text-gray-400 mb-6" />
        <p className="text-xl font-semibold text-gray-700 mb-2">
          Location Access Required
        </p>
        <p className="text-gray-500 mb-4">
          To browse this section, please allow location access.
        </p>
        <LocationBadge />
      </div>
    );
  }

  return <>{children}</>;
}
