import React from "react";
import Restaurant from "./Restaurant";
import Info from "./Info";
import { supabase } from "@/supabaseClient";
import Menu from "./components/Menu";
import Information from "./components/Information";
import ScrollButton from "@/app/components/ScrollButton";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

import { Metadata } from "next";
export async function generateMetadata({
  params,
}: Readonly<{
  params: { location_id: string };
}>): Promise<Metadata> {
  const { location_id } = params;

  const { data: location, error: locationError } = await supabase
    .from("locations")
    .select("*")
    .eq("location_id", location_id)
    .single();

  if (locationError || !location) {
    console.error(locationError);
    return {
      title: "Location not found",
      description: "The requested location could not be found.",
    };
  }

  const imageUrl = location.image_id
    ? `https://wsuteglijvwrmcsjhhom.supabase.co/storage/v1/object/public/IMG_LOGOS/${location.image_id}.png`
    : "/default-location.jpg";

  const address = `${location.street}, ${location.suburb}, ${location.state}, ${location.post_code}`;

  const openingHours = `
    Mon: ${location.open_mon || "Closed"}, 
    Tue: ${location.open_tues || "Closed"}, 
    Wed: ${location.open_wed || "Closed"}, 
    Thu: ${location.open_thur || "Closed"}, 
    Fri: ${location.open_fri || "Closed"}, 
    Sat: ${location.open_sat || "Closed"}, 
    Sun: ${location.open_sun || "Closed"}
  `;

  return {
    title: `${location.company_name} - ${location.cuisine}`,
    description: location.description || "Discover more about this location.",
    openGraph: {
      images: [imageUrl],
      type: "website",
      url: `https://yourwebsite.com/locations/${location_id}`,
      title: `${location.company_name} - ${location.cuisine}`,
      description: location.description || "Discover more about this location.",
    },
    twitter: {
      card: "summary_large_image",
      title: `${location.company_name} - ${location.cuisine}`,
      description: location.description || "Discover more about this location.",
      images: [imageUrl],
    },
    other: {
      address: address,
      opening_hours: openingHours.trim(),
    },
  };
}

export default async function Page({
  params,
}: {
  params: { location_id: string };
}) {
  const { location_id } = params;

  const { data: location, error: locationError } = await supabase
    .from("locations")
    .select("*")
    .eq("location_id", location_id)
    .single();

  if (locationError) {
    return <div>Error: {locationError.message}</div>;
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("rest_id", location.restaurant_id);

  if (productsError) {
    return <div>Error: {productsError.message}</div>;
  }

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const openingHours: { [key: string]: string } = {
    monday: location.open_mon,
    tuesday: location.open_tues,
    wednesday: location.open_wed,
    thursday: location.open_thur,
    friday: location.open_fri,
    saturday: location.open_sat,
    sunday: location.open_sun,
  };

  return (
    <>
      <Navbar showFilters={true} />
      <div className=" ">
        <Restaurant location={location} products={products} />
        <Info
          cuisine={location.cuisine}
          openingHoursToday={openingHours[today]}
          googlePlacesId={location.google_places_id}
        />
        <Menu products={products} />
        <Information
          description={location.description}
          address={location.address}
          openingHours={{
            Monday: location.open_mon,
            Tuesday: location.open_tues,
            Wednesday: location.open_wed,
            Thursday: location.open_thur,
            Friday: location.open_fri,
            Saturday: location.open_sat,
            Sunday: location.open_sun,
          }}
        />
        <ScrollButton />
      </div>
      <Footer />
    </>
  );
}
