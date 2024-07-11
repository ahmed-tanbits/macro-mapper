"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { ChevronRight } from "lucide-react"; // Ensure you have this icon installed or import it correctly

// Use the environment variable for the Mapbox token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const LocationButton: React.FC = () => {
  const [buttonText, setButtonText] = useState("Allow Location");
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    const cityFromCookie = Cookies.get("city");

    if (cityFromCookie) {
      setButtonText(cityFromCookie);
      setCity(cityFromCookie);
    }
  }, []);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            // Fetch the city name using a reverse geocoding API
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}`
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const city = data.features.find((feature: any) =>
              feature.place_type.includes("place")
            )?.text;

            const userLocation = {
              latitude: lat,
              longitude: lon,
              city: city || "Unknown location",
            };

            Cookies.set("latitude", String(lat), { expires: 7 });
            Cookies.set("longitude", String(lon), { expires: 7 });
            Cookies.set("city", userLocation.city, { expires: 7 });

            setButtonText(userLocation.city);
            setCity(userLocation.city);
            window.location.reload(); // Refresh the page
          } catch (error) {
            console.error("Error fetching city name:", error);
            alert("Error fetching city name. Please try again.");
          }
        },
        (error) => {
          console.error("Error obtaining location:", error);
          alert(
            "Error obtaining location. Please ensure location services are enabled."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <>
    {city ? (
      <div className="flex gap-2 z-10 justify-start items-center pr-1">
        <Link
          href={`/search/map`}
          className="relative flex items-center py-1 px-3 bg-primary-500 h-8 transition-all cursor-pointer select-none text-white rounded-full group hover:pr-6 text-sm lg:py-1.5 lg:px-4 lg:h-10 lg:hover:pr-8"
        >
          <span className="transition-all">{city}</span>
          <ChevronRight
            strokeWidth={1.8}
            className="w-4 h-4 lg:w-5 lg:h-5 absolute right-2 transition-transform transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300"
          />
        </Link>
      </div>
    ) : (
      <button
        onClick={handleLocationClick}
        className="bg-primary-500 whitespace-nowrap transition-all z-20 hover:bg-primary-600 h-8 mr-1 px-3 select-none cursor-pointer rounded-full flex items-center justify-center text-white text-sm lg:h-10 lg:mr-1 lg:px-5 lg:text-base"
      >
        {buttonText}
      </button>
    )}
  </>
  
  );
};

export default LocationButton;
