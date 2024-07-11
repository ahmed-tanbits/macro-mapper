import React from "react";
import OpeningHours from "./OpeningHours";

type Props = {
  description: string;
  address: string;
  openingHours: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
};

export default function Information({
  description,
  address,
  openingHours,
}: Props) {
  return (
    <div className="w-full bg-white flex flex-col lg:flex-row items-start justify-between px-4 lg:px-8 pt-8 pb-0 relative">
      <div className="pb-8 lg:pb-20 max-w-full lg:max-w-sm pr-0 lg:pr-10">
        <p>{description}</p>
      </div>
      <div className="w-full h-[1px] lg:w-[1px] lg:h-64 bg-neutral-200 my-8 lg:my-0"></div>
      <div className="pb-8 lg:pb-20 max-w-full lg:max-w-sm px-0 lg:px-10">
        <h2 className="text-xl font-bold mb-4">Address</h2>
        <p className="text-sm text-neutral-500">{address}</p>
      </div>
      <div className="w-full h-[1px] lg:w-[1px] lg:h-64 bg-neutral-200 my-8 lg:my-0"></div>
      <div className="pb-8 lg:pb-20 pl-0 lg:pl-10 w-full lg:max-w-md">
        <OpeningHours hours={openingHours} />
      </div>
    </div>
  );
}
