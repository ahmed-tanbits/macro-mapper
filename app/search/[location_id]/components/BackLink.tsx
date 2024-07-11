"use client";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const BackLink: React.FC = () => {
  const router = useRouter();
  const [hasPreviousUrl, setHasPreviousUrl] = useState(false);

  useEffect(() => {
    // Check if there is a previous URL in the history
    if (window.history.length > 1) {
      setHasPreviousUrl(true);
    }
  }, []);

  const handleBackClick = () => {
    router.back();
  };

  if (!hasPreviousUrl) {
    return null;
  }

  return (
    <button
      onClick={handleBackClick}
      className="relative flex items-center py-2 px-4 pl-10 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-all cursor-pointer select-none rounded-xl whitespace-nowrap group"
    >
      <span className="transition-all">Go Back</span>
      <ChevronLeft
        size={18}
        strokeWidth={1.8}
        className="absolute left-2 ml-1 transition-transform transform translate-x-0 opacity-100 group-hover:-translate-x-full group-hover:opacity-0 duration-300"
      />
      <ArrowLeft
        size={18}
        strokeWidth={1.8}
        className="absolute left-2 ml-1 transition-transform transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300"
      />
    </button>
  );
};

export default BackLink;
