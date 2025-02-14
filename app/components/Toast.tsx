"use client";
import React, { useEffect } from "react";
import { useToast } from "../hooks/useToast";

// Cross icon (SVG)
const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-white cursor-pointer"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const Toast: React.FC = () => {
  const { toast, toastContent, hideToast } = useToast();

  if (!toastContent) {
    return null;
  }

  const { type, description, position = "top-right" } = toastContent;

  // Set styles based on the toast type
  const toastStyles = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  // Set position styles
  const positionStyles = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div
      className={`fixed p-4 rounded-md shadow-lg text-white ${toastStyles[type]} ${positionStyles[position]} z-50`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p>{description}</p>
        <span onClick={hideToast} className="ml-2">
          <CrossIcon />
        </span>
      </div>
    </div>
  );
};

export default Toast;