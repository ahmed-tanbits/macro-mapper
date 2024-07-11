import { List, Map } from "lucide-react";
import React from "react";

type Props = { 
  isMap: boolean;
  toggleView: () => void;
};

export default function Toggle({ isMap, toggleView }: Props) {
  return (
    <button
      onClick={toggleView}
      className="absolute z-40 px-5 py-2 rounded-full font-semibold text-white bg-primary-500 bottom-6 left-1/2 transform -translate-x-1/2 flex lg:hidden gap-2 items-center justify-center whitespace-nowrap"
    >
      {isMap ? <List /> : <Map />}
      {isMap ? "List View" : "Map View"}
    </button>
  );
}
