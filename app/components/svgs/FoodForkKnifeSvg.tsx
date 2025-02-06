import React from "react";

type FoodForkKnifeSvgProps = {
  color?: string;
  active?: boolean;
  height?: number;
  width?: number;
};

const FoodForkKnifeSvg: React.FC<FoodForkKnifeSvgProps> = ({
  color = "#2D2E2F",
  active = false,
  height,
  width,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.44444 3.5H3.33333V0H2.22222V3.5H1.11111V0H0V3.5C0 4.56 0.922222 5.42 2.08333 5.485V10H3.47222V5.485C4.63333 5.42 5.55556 4.56 5.55556 3.5V0H4.44444V3.5ZM7.22222 2V6H8.61111V10H10V0C8.46667 0 7.22222 1.12 7.22222 2Z"
        fill="#6D6D6D"
      />
    </svg>
  );
};

export default FoodForkKnifeSvg;
