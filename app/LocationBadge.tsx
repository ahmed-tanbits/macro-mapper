"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { MapPinOff } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const LocationBadge: React.FC = () => {
  const [locationAllowed, setLocationAllowed] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState("Allow Location");
  const [city, setCity] = useState<string | null>(null);

  useEffect(() => {
    const cityFromCookie = Cookies.get("city");

    if (cityFromCookie) {
      setLocationAllowed(true);
      setCity(cityFromCookie);
    }

    const handleStorageChange = () => {
      const lat = Cookies.get("latitude");
      const lon = Cookies.get("longitude");
      if (lat && lon) {
        setLocationAllowed(true);
        setCity(Cookies.get("city") || null);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!locationAllowed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [locationAllowed]);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
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
            setLocationAllowed(true);
            window.location.reload();
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

  if (locationAllowed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-sky-600 text-white p-10 flex justify-between items-center z-50">
      <div className="flex justify-between items-center gap-5">
        <MapPinOff size={48} strokeWidth={1.2} className="text-yellow-400" />
        <div className="flex flex-col text-neutral-100">
          <p className="mb-2">
            To browse nearby restaurants and food items, you need to allow
            location.
          </p>
          <p className="text-sm">
            Your location information is{" "}
            <span className=" text-white font-bold underline">
              ONLY stored on your device and never seen by us.
            </span>
          </p>
        </div>
      </div>
      <button
        onClick={handleLocationClick}
        className="bg-white text-sky-700 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-all"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default LocationBadge;
