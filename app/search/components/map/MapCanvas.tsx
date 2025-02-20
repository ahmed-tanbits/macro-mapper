"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Map, {
  Marker,
  ViewStateChangeEvent,
  MapRef,
  MapboxEvent,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Cookies from "js-cookie";
import { supabase } from "@/supabaseClient";
import Tooltip from "./Tooltip";
import CustomPopup from "./CustomPopup";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface Location {
  location_id: string;
  lat: number;
  long: number;
  restaurant_id: string;
}

type Props = {
  highlightedRestaurantId?: string | null;
  clearHighlightedLocations: () => void;
};

const MapCanvas: React.FC<Props> = ({
  highlightedRestaurantId,
  clearHighlightedLocations,
}) => {
  const mapRef = useRef<MapRef>(null);

  const [viewport, setViewport] = useState<Viewport>({
    latitude: Cookies.get("latitude")
      ? parseFloat(Cookies.get("latitude")!)
      : -25.2744,
    longitude: Cookies.get("longitude")
      ? parseFloat(Cookies.get("longitude")!)
      : 133.7751,
    zoom: Cookies.get("latitude") && Cookies.get("longitude") ? 15 : 4,
  });

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    city?: string;
  } | null>(null);

  const [mapKey, setMapKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [highlightedLocations, setHighlightedLocations] = useState<Location[]>(
    []
  );
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [tooltipData, setTooltipData] = useState<{
    company_name: string;
    image_id: string;
    location_id: string;
    google_places_id: string;
  } | null>(null);
  const [isTooltipLoading, setIsTooltipLoading] = useState(false);

  const fetchLocationsWithinBounds = useCallback(
    async (bounds: mapboxgl.LngLatBounds | null) => {
      if (bounds) {
        const { _ne: northEast, _sw: southWest } = bounds;
        try {
          const { data: locations, error } = await supabase
            .from("locations")
            .select("location_id, lat, long, restaurant_id")
            .gte("lat", southWest.lat)
            .lte("lat", northEast.lat)
            .gte("long", southWest.lng)
            .lte("long", northEast.lng);

          if (error) {
            throw new Error(error.message);
          }

          setLocations(locations);
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      }
    },
    []
  );

  const fetchTooltipData = async (location_id: string) => {
    setIsTooltipLoading(true);
    try {
      const { data: location, error } = await supabase
        .from("locations")
        .select("company_name, image_id, google_places_id")
        .eq("location_id", location_id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setTooltipData({
        company_name: location.company_name,
        image_id: location.image_id,
        google_places_id: location.google_places_id,
        location_id,
      });
    } catch (error) {
      console.error("Error fetching tooltip data:", error);
    } finally {
      setIsTooltipLoading(false);
    }
  };

  useEffect(() => {
    const lat = Cookies.get("latitude");
    const lon = Cookies.get("longitude");
    const city = Cookies.get("city");

    if (lat && lon) {
      const location = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        city: city || "Unknown location",
      };
      setUserLocation(location);
      setViewport({
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 13,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (highlightedRestaurantId) {
      const highlightLocations = async () => {
        try {
          const { data: locations, error } = await supabase
            .from("locations")
            .select("location_id, lat, long, restaurant_id")
            .eq("restaurant_id", highlightedRestaurantId);

          if (error) {
            throw new Error(error.message);
          }

          setHighlightedLocations(locations);
        } catch (error) {
          console.error("Error fetching locations for restaurant:", error);
        }
      };

      highlightLocations();
    } else {
      setHighlightedLocations([]);
    }
  }, [highlightedRestaurantId]);

  const handleViewportChange = (evt: ViewStateChangeEvent) => {
    const { viewState } = evt;
    setViewport(viewState);
    fetchLocationsWithinBounds(evt.target.getBounds());
  };

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    fetchTooltipData(location.location_id);
  };

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

            setUserLocation(userLocation);
            setViewport({
              latitude: lat,
              longitude: lon,
              zoom: 13,
            });

            setMapKey((prevKey) => prevKey + 1);
            setLoading(false);
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

  const handleMapLoad = (event: MapboxEvent) => {
    const map = event.target;
    fetchLocationsWithinBounds(map.getBounds());
    setLoading(false);
  };

  return (
    <div className="relative w-full h-screen lg:h-full lg:rounded-tl-2xl lg:rounded-bl-2xl overflow-clip bg-transparent">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-neutral-200 animate-pulse rounded-tl-2xl rounded-bl-2xl">
          <div className="w-full h-full bg-neutral-100 rounded-tl-2xl rounded-bl-2xl" />
        </div>
      )}
      <Map
        key={mapKey}
        initialViewState={viewport}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/hubaferencz/clwz1916e01j901qrhb035roo"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={handleViewportChange}
        onLoad={handleMapLoad}
        ref={mapRef}
      >
        {userLocation && (
          <Marker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
          >
            <div className="w-5 aspect-square rounded-lg z-30 text-white p-0.5 bg-sky-500 shadow-lg shadow-sky-500 border-2 border-white select-none"></div>
          </Marker>
        )}
        {locations.map((location) => (
          <Marker
            key={location.location_id}
            latitude={location.lat}
            longitude={location.long}
            onClick={() => handleMarkerClick(location)}
          >
            <div
              className={`w-5 aspect-square m-3 transition-all z-10 rounded-full text-white p-0.5 ${highlightedRestaurantId &&
                  location.restaurant_id === highlightedRestaurantId
                  ? "bg-orange-500 "
                  : "bg-primary-500 shadow-primary-500"
                } border-2 border-white select-none cursor-pointer`}
            ></div>
          </Marker>
        ))}
        {highlightedLocations.map((location) => (
          <Marker
            key={location.location_id}
            latitude={location.lat}
            longitude={location.long}
            onClick={() => handleMarkerClick(location)}
          >
            <div className="w-5 aspect-square m-3 z-10 rounded-full text-white p-0.5 bg-orange-500 shadow-lg border-2 border-white select-none cursor-pointer"></div>
          </Marker>
        ))}
        {selectedLocation && (
          <CustomPopup
            latitude={selectedLocation.lat}
            longitude={selectedLocation.long}
            onClose={() => setSelectedLocation(null)}
            closeButton={true} // Enable the close button
            closeOnClick={false} // Ensure it doesn't close on click outside
            anchor="top"
            className="custom-popup"
          >
            {tooltipData && (
              <Tooltip
                company_name={tooltipData.company_name}
                image_id={tooltipData.image_id}
                location_id={tooltipData.location_id}
                google_places_id={tooltipData.google_places_id}
                isLoading={isTooltipLoading}
              />
            )}
          </CustomPopup>
        )}
      </Map>
      {!userLocation && (
        <button
          onClick={handleLocationClick}
          className="absolute z-20 top-4 left-4 bg-primary-500 whitespace-nowrap transition-all hover:bg-primary-600 h-10 mr-1 px-5 select-none cursor-pointer rounded-full flex items-center justify-center text-white"
        >
          Get Location
        </button>
      )}
      {highlightedLocations.length > 0 && (
        <button
          onClick={clearHighlightedLocations}
          className="absolute z-20 top-4 left-4 bg-orange-500 whitespace-nowrap transition-all hover:bg-orange-600 h-10 mr-1 px-5 select-none cursor-pointer rounded-full flex items-center justify-center text-white"
        >
          Clear Highlights
        </button>
      )}
    </div>
  );
};

export default MapCanvas;
