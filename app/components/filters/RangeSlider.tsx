import { ChevronDown, ChevronRight, RotateCcw, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";

type RangeSliderProps = {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  onRangeChange: (range: [number, number]) => void;
  initialValues?: [number, number];
  isAuthenticated?: boolean;
};

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  unit,
  min,
  max,
  step,
  onRangeChange,
  initialValues,
  isAuthenticated,
}) => {
  const [values, setValues] = useState<[number, number]>(
    initialValues || [min, max]
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleRangeChange = (values: number[]) => {
    const rangeValues: [number, number] = [values[0], values[1]];
    setValues(rangeValues);
    onRangeChange(rangeValues);
  };

  const clearSelections = () => {
    const initialValues: [number, number] = [min, max];
    setValues(initialValues);
    onRangeChange(initialValues);
  };
  `x`;
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="whitespace-nowrap relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`px-1 sm:px-2 py-2 bg-transparent text-gray-900 text-xs sm:text-sm ${
          isOpen || values.some((value) => value !== min && value !== max)
            ? "border-primary-500 border-opacity-60 bg-primary-500 bg-opacity-10"
            : "border-neutral-100 bg-neutral-100 lg:bg-white"
        } lg:rounded-xl flex items-center justify-center space-x-2`}
      >
        <span
          className={`${
            isOpen || values.some((value) => value !== min && value !== max)
              ? "text-primary-500"
              : ""
          }`}
        >
          {label}
        </span>
        {isAuthenticated ? (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            } ${
              isOpen || values.some((value) => value !== min && value !== max)
                ? "text-primary-500"
                : ""
            }`}
          />
        ) : (
          <Image src="/lock-icon.png" alt="lock-icon" height={12} width={12} />
        )}
      </button>
      {isAuthenticated && isOpen && (
        <div className="absolute left-0 mt-3 z-50 bg-white border overflow-clip border-neutral-100 shadow-md shadow-gray-300 rounded-xl rounded-tl-none w-60 lg:w-80 before:absolute before:content-[''] before:top-0 before:left-0 before:h-[3px] before:w-[140px] before:bg-[#00CF3A]">
          <div className="px-6 pt-5 pb-1 flex justify-between font-medium text-sm">
            <span>
              {values[0]} {unit}
            </span>
            <span>
              {values[1] === max ? max + "+" : values[1]} {unit}
            </span>
          </div>
          <div className="px-5 pt-3 pb-5">
            <Range
              step={step}
              min={min}
              max={max}
              values={values}
              onChange={handleRangeChange}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "4px",
                    display: "flex",
                    width: "100%",
                    background: getTrackBackground({
                      values: values,
                      colors: ["#d4d4d4", "#00C853", "#d4d4d4"],
                      min: min,
                      max: max,
                    }),
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "18px",
                    width: "18px",
                    borderRadius: "50%",
                    border: "1px solid #d4d4d4",
                    backgroundColor: "#ffff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 1px 4px #d4d4d4",
                  }}
                />
              )}
            />
          </div>

          <div className="bg-neutral-50 border-t border-neutral-100 px-3 py-2 flex justify-end text-sm">
            <button
              onClick={clearSelections}
              className="p-2 text-[#737373] flex gap-1 items-center h-min"
            >
              <RotateCcw size={16} />
              Reset this filter
            </button>
            {/* <button
                       onClick={closeDropdown}
                       className="p-2 text-neutral-500 bg-neutral-200 rounded-lg block lg:hidden"
                     >
                       <X size={16} />
                     </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default RangeSlider;
