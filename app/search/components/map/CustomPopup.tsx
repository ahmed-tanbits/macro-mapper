import React, { useRef } from "react";
import { Popup } from "react-map-gl";
import { X } from "lucide-react"; // Importing the X icon from lucide-react

interface CustomPopupProps {
  latitude: number;
  longitude: number;
  anchor?: "center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  className?: string;
  closeButton?: boolean;
  closeOnClick?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomPopup: React.FC<CustomPopupProps> = ({
  latitude,
  longitude,
  anchor,
  className,
  closeButton = true, // Enable close button by default
  closeOnClick = false, // Disable close on click outside
  onClose,
  children,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={popupRef}>
      <Popup
        latitude={latitude}
        longitude={longitude}
        anchor={anchor}
        className={className}
        closeButton={false} // Disable the default close button
        closeOnClick={closeOnClick}
        onClose={onClose}
      >
        <div className="relative p-2 bg-white shadow-lg  rounded-lg flex gap-3 items-start justify-start w-72 overflow-clip">
          {children}
          <button
            onClick={onClose}
            className="  hover:bg-neutral-200 bg-neutral-100 border border-transparent transition-all text-neutral-600 flex items-center justify-center rounded-full w-7 h-7 aspect-square absolute bottom-2 right-20 -mr-2"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      </Popup>
    </div>
  );
};

export default CustomPopup;
