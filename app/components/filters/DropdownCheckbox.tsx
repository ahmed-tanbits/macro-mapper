import React, { useState, useRef, useEffect } from "react";
import CustomCheckbox from "@/app/components/filters/CustomCheckbox";
import { ChevronDown, ChevronRight, RotateCcw, X } from "lucide-react";
import Link from "next/link";

type CheckboxOption = {
  id: number;
  label: string;
  key: string;
  checked: boolean;
};

type DropdownCheckboxProps = {
  options: CheckboxOption[];
  label: string;
  onSelectionChange: (selectedOptions: CheckboxOption[]) => void;
  initialOptions?: CheckboxOption[];
};

const DropdownCheckbox: React.FC<DropdownCheckboxProps> = ({
  options: initialOptions = [], // Default to an empty array if not provided
  label,
  onSelectionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<CheckboxOption[]>(initialOptions);

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

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (id: number) => {
    const newOptions = options.map((option) =>
      option.id === id ? { ...option, checked: !option.checked } : option
    );
    setOptions(newOptions);
    onSelectionChange(newOptions);
  };

  const clearSelections = () => {
    const clearedOptions = options.map((option) => ({
      ...option,
      checked: false,
    }));
    setOptions(clearedOptions);
    onSelectionChange(clearedOptions);
  };

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="whitespace-nowrap lg:relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`px-4 py-2 bg-neutral-100 rounded-full text-neutral-500 border ${
          isOpen || options.some((opt) => opt.checked)
            ? "border-primary-500 border-opacity-60 bg-primary-500 bg-opacity-10"
            : "border-neutral-100 bg-neutral-100 lg:bg-white"
        } lg:rounded-xl flex items-center justify-center space-x-2`}
      >
        <span
          className={`${
            isOpen || options.some((opt) => opt.checked)
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
            isOpen || options.some((opt) => opt.checked)
              ? "text-primary-500"
              : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="absolute mt-2 z-50 bg-white border overflow-clip border-neutral-100 shadow-xl rounded-xl w-96 left-1/2 transform -translate-x-1/2 lg:mt-2">
          <div className="overflow-auto max-h-40 p-2">
            {options.map((option) => (
              <div key={option.id} className="px-3 py-2">
                <CustomCheckbox
                  checked={option.checked}
                  onChange={() => handleCheckboxChange(option.id)}
                  label={option.label}
                />
              </div>
            ))}
          </div>
          <div className="bg-neutral-50 border-t border-neutral-100 p-4 flex justify-between items-center text-sm">
            <button
              onClick={clearSelections}
              className="p-2 text-yellow-600 bg-yellow-500 bg-opacity-25 rounded-lg flex items-center justify-center h-min gap-1"
            >
              <RotateCcw size={16} />
              Reset this filter
            </button>
            <button
              onClick={closeDropdown}
              className="p-2 text-neutral-500 bg-neutral-200 rounded-lg block lg:hidden"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownCheckbox;
