import { ChevronDown, RotateCcw } from "lucide-react";
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
};

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  unit,
  min,
  max,
  step,
  onRangeChange,
  initialValues,
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

  return (
    <div className="whitespace-nowrap" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`px-4 py-2 text-neutral-500 border ${
          isOpen || values.some((value) => value !== min && value !== max)
            ? "border-primary-500 border-opacity-60 bg-primary-500 bg-opacity-10"
            : "border-neutral-100 bg-white"
        } rounded-xl flex items-center justify-center space-x-2`}
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

        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          } ${
            isOpen || values.some((value) => value !== min && value !== max)
              ? "text-primary-500"
              : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="fixed mt-2 z-50 bg-white border overflow-clip border-neutral-100 shadow-xl rounded-xl w-96 left-2/3 transform -translate-x-1/2">
          <div className="px-6 pt-4 flex justify-between font-medium">
            <span>
              {values[0]} {unit}
            </span>
            <span>
              {values[1] === max ? max + "+" : values[1]} {unit}
            </span>
          </div>
          <div className="p-5">
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
                    height: "5px",
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
                    height: "24px",
                    width: "24px",
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

          <div className="bg-neutral-50 border-t border-neutral-100 mt-2">
            <div className="flex justify-end text-sm gap-2 p-2">
              <button
                onClick={clearSelections}
                className="text-neutral-500 px-4 py-2 flex items-center justify-center gap-1 hover:text-yellow-600"
              >
                <RotateCcw size={14} />
                Reset this filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RangeSlider;
