import React, { useState, useRef, useEffect } from "react";
import RadioBox from "./RadioBox";
import { ArrowDownUp } from "lucide-react";

const sort_options = [
  { id: 1, label: "Default", checked: true },
  { id: 2, label: "Lowest Calories", checked: false },
  { id: 3, label: "Highest Calories", checked: false },
  { id: 6, label: "Lowest Fat", checked: false },
  { id: 7, label: "Highest Fat", checked: false },
  { id: 4, label: "Lowest Protein", checked: false },
  { id: 5, label: "Highest Protein", checked: false },
  { id: 8, label: "Lowest Carbs", checked: false },
  { id: 9, label: "Highest Carbs", checked: false },
];

type SortProps = {
  onSortChange: (sortOption: string) => void;
};

export default function Sort({ onSortChange }: SortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<CheckboxOption[]>(sort_options);
  const [selectedLabel, setSelectedLabel] = useState("Sort");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleRadioChange = (id: number) => {
    const newOptions = options.map((option) => ({
      ...option,
      checked: option.id === id,
    }));
    const selectedOption = newOptions.find((option) => option.checked);
    setOptions(newOptions);
    setSelectedLabel(selectedOption && selectedOption.id !== 1 ? `From: ${selectedOption.label}` : "Sort");
    setIsOpen(false);

    // Pass the selected sorting option back to the parent component
    if (selectedOption) {
      onSortChange(selectedOption.label);
    }
  };

  const isDefaultSelected = options.find((option) => option.id === 1)?.checked;

  return (
    <div className="relative whitespace-nowrap" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`px-4 py-2 text-neutral-500 border transition-colors duration-300 ${
          isOpen || !isDefaultSelected
            ? "border-primary-500 border-opacity-60 bg-primary-500 bg-opacity-10"
            : "border-neutral-100 bg-white"
        } rounded-xl flex items-center justify-center space-x-2`}
      >
        <span
          className={`${
            !isDefaultSelected || isOpen ? "text-primary-600" : ""
          }`}
        >
          {selectedLabel}
        </span>
        {isDefaultSelected && (
          <ArrowDownUp
            className={`size-4 ${
              isOpen ? "text-primary-500" : "text-neutral-500"
            }`}
          />
        )}
      </button>
      {isOpen && (
        <div className="fixed mt-3 z-30 bg-white border overflow-clip border-neutral-100 shadow-xl rounded-xl w-64 right-4 transition-all duration-300">
          <div className="overflow-auto max-h-40 p-2">
            {options.map((option) => (
              <div key={option.id} className="px-3 py-2">
                <RadioBox
                  checked={option.checked}
                  onChange={() => handleRadioChange(option.id)}
                  label={option.label}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
