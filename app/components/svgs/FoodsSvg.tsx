import React from "react";

type FoodsSvgProps = {
  color?: string;
  active?: boolean;
  height?: number;
  width?: number;
};

const FoodsSvg: React.FC<FoodsSvgProps> = ({
  color = "#2D2E2F",
  active = false,
  height,
  width,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill="none"
      className="mr-2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.88504 11.2425L1.28376 6.63799C0.461612 5.81008 0 4.68913 0 3.52055C0 2.35198 0.461612 1.23102 1.28376 0.403118L8.99282 8.11409L5.88504 11.2425ZM13.3305 9.2487L11.7163 10.868L19.2716 18.4468L17.7232 20L10.1679 12.4212L2.61253 20L1.06413 18.4468L11.7821 7.69549C11.0024 6.0101 11.5515 3.64173 13.2976 1.89023C15.3951 -0.224776 18.404 -0.62134 20.0073 0.986949C21.6216 2.60625 21.2263 5.62455 19.1178 7.72854C17.3718 9.48003 15.0107 10.0308 13.3305 9.2487Z"
        fill={active ? "#0AC600" : color}
      />
    </svg>
  );
};

export default FoodsSvg;
