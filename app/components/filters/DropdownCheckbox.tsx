import React, { useState, useRef, useEffect } from "react";
import CustomCheckbox from "@/app/components/filters/CustomCheckbox";
import { ChevronDown, ChevronRight, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
  isAuthenticated?: boolean;
  onClick?: () => void;
};

const DropdownCheckbox: React.FC<DropdownCheckboxProps> = ({
  options: initialOptions = [], // Default to an empty array if not provided
  label,
  onSelectionChange,
  isAuthenticated,
  onClick,
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

  const toggleDropdown = () => {
    if (!isAuthenticated && onClick) {
      onClick(); // Open subscription modal
    } else {
      setIsOpen(!isOpen);
    }
  };

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
    <div className="whitespace-nowrap relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`px-1 sm:px-2 py-2 bg-transparent text-gray-900 text-xs sm:text-sm ${
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

        {isAuthenticated ? (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            } ${
              isOpen || options.some((opt) => opt.checked)
                ? "text-primary-500"
                : ""
            }`}
          />
        ) : (
          <Image src="/lock-icon.png" alt="lock-icon" height={12} width={12} />
        )}
      </button>
      {isAuthenticated && isOpen && (
        <div className="absolute left-1/2 lg:left-0 -translate-x-1/3 lg:-translate-x-0 mt-3 z-50 bg-white border overflow-clip border-neutral-100 shadow-md shadow-gray-300 rounded-xl rounded-tl-none w-60 lg:w-80 before:absolute before:content-[''] before:top-0 before:left-0 before:h-[3px] before:w-[140px] before:bg-[#00CF3A]">
          <div className="overflow-auto max-h-40 px-2 py-4">
            {options.map((option) => (
              <div key={option.id} className="px-3 py-[5px] text-sm">
                <CustomCheckbox
                  checked={option.checked}
                  onChange={() => handleCheckboxChange(option.id)}
                  label={option.label}
                />
              </div>
            ))}
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

export default DropdownCheckbox;
