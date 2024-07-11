"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

const DisclaimerPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem("isFirstVisit");
    if (!isFirstVisit) {
      setShowPopup(true);
      localStorage.setItem("isFirstVisit", "false");
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-primary-500 select-none text-white p-4 rounded-2xl shadow-lg max-w-sm w-full z-50">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Disclaimer</span>
        <button onClick={handleClose}>
          <X size={20} strokeWidth={3} />
        </button>
      </div>
      <p className="mt-2 text-sm">
        The nutritional information provided on Macromapper is indicative and
        may not be 100% accurate. Before making any dining decisions based on
        this information, please consult directly with the restaurant. By
        continuing to use this site, you agree to our disclaimer and terms of
        use found{" "}
        <Link
          href={"/terms-and-conditions"}
          target="_blank"
          className=" underline font-medium"
        >
          here
        </Link>
        .
      </p>
    </div>
  );
};

export default DisclaimerPopup;
