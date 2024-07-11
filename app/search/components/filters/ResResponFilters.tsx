"use client";
import React from "react";
import CusCheckbox from "./CusCheckbox";
import ResponsiveCusCheckbox from "./ResponsiveCusCheckbox";
import Image from "next/image";

const cuisineOptions = [
  { id: 1, label: "Mexican", key: "Mexican", checked: false },
  {
    id: 2,
    label: "Fast food restaurant",
    key: "Fast food restaurant",
    checked: false,
  },
];

export default function ResResponFilters({ onSelectionChange }: any) {
  return (
    <div className="mt-4 flex gap-3 items-start justify-start w-full max-w-full overflow-x-scroll hide-scrollbar">

      <Image
        src={"/logo-square.png"}
        width={50}
        height={50}
        alt="macromapper filter bar square logo"
        className=" lg:hidden aspect-square w-auto h-10 bg-white z-30"
      />
      <ResponsiveCusCheckbox
        options={cuisineOptions}
        label="Cuisines"
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}
