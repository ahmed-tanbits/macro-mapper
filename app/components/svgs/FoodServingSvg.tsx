import React from "react";

type FoodServingSvgProps = {
  color?: string;
  active?: boolean;
  height?: number;
  width?: number;
};

const FoodServingSvg: React.FC<FoodServingSvgProps> = ({
  color = "#2D2E2F",
  active = false,
  height,
  width,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.53 11H9.36C9.78 11 10.125 10.675 10.175 10.265L11 2.025H8.5V0H7.515V2.025H5.03L5.18 3.195C6.035 3.43 6.835 3.855 7.315 4.325C8.035 5.035 8.53 5.77 8.53 6.97V11ZM0 10.5V10H7.515V10.5C7.515 10.77 7.29 11 7 11H0.5C0.225 11 0 10.77 0 10.5ZM7.515 7C7.515 3 0 3 0 7H7.515ZM0 8H7.5V9H0V8Z"
        fill="#6D6D6D"
      />
    </svg>
  );
};

export default FoodServingSvg;
