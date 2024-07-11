import React, { useState, useRef, useEffect } from "react";
import CustomCheckbox from "@/app/components/filters/CustomCheckbox";
import { ChevronDown, RotateCcw } from "lucide-react";

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

  return (
    <div className="whitespace-nowrap" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`px-4 py-2 text-neutral-500 border ${
          isOpen || options.some((opt) => opt.checked)
            ? "border-primary-500 border-opacity-60 bg-primary-500 bg-opacity-10"
            : "border-neutral-100 bg-white"
        } rounded-xl flex items-center justify-center space-x-2`}
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
        <div className="fixed mt-2 z-50 bg-white border overflow-clip border-neutral-100 shadow-xl rounded-xl w-96 left-2/3 transform -translate-x-1/2">
          <div className="overflow-auto max-h-40  p-2">
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

export default DropdownCheckbox;
