import React from "react";

type Props = {
  hours: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
};

const OpeningHours = ({ hours }: Props) => {
  const days = Object.entries(hours);

  return (
    <div className="bg-white w-full max-w-md text-sm">
      <h2 className="text-xl font-bold mb-4 px-4">Opening Hours</h2>
      <ul className="text-neutral-500">
        {days.map(([day, hours], index) => (
          <li
            key={day}
            className={`flex justify-between px-4 hover:bg-neutral-50 py-3 ${
              index !== days.length - 1 ? "border-b border-neutral-100" : ""
            }`}
          >
            <span className="font-medium">{day}</span>
            <span>{hours}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpeningHours;
