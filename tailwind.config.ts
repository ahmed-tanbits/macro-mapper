import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "1200": "1200px",
        "992": "992px",
        "425": "425px",
      },
      colors: {
        primary: {
          50: "#00FF54",
          100: "#00FF51",
          200: "#00FF4B",
          300: "#00F846",
          400: "#00E440",
          500: "#00CF3A",
          600: "#00BA34",
          700: "#00A62E",
          800: "#009129",
          900: "#007C23",
          950: "#007220",
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
export default config;
