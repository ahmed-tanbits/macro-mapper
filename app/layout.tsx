import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import LocationBadge from "./LocationBadge";
import { FilterProvider } from "./context/FilterContext";
import EmailVerification from "./components/EmailVerification";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Macromapper: Discover Nutritional Information and Macros of Restaurants Across Australia",
  description:
    "Explore Macromapper to find detailed nutritional information and macros for restaurants all over Australia. Filter by protein, allergens, and more to make informed dining choices. Browse our extensive database or discover nearby restaurants effortlessly. Perfect for health-conscious foodies and anyone with dietary needs. Start exploring today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <FilterProvider>
          {children}
          <LocationBadge />
          <SpeedInsights />
          <EmailVerification />
        </FilterProvider>
      </body>
    </html>
  );
}
