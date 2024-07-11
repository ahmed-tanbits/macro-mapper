// RadioBox.tsx
import React from "react";

type Props = {
  checked: boolean;
  onChange: () => void;
  label: string;
};

const RadioBox: React.FC<Props> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer font-medium">
      <span className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        {/* Update styles for a smaller size and border/color fill logic */}
        <span
          className={`block w-3.5 h-3.5 rounded-full border ${
            checked ? "bg-neutral-700 border-neutral-700" : "border-neutral-400"
          }`}
        ></span>
      </span>
      <span className="text-neutral-700 select-none">{label}</span>
    </label>
  );
};

export default RadioBox;
