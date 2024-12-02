import type { Config } from "tailwindcss";
import colors from "@/constants/colors";

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "main-background": {
          DEFAULT: "var(--color-main-background)",
        },
        "header-background": {
          DEFAULT: "var(--color-header-background)",
        },
        "shadow-30": {
          DEFAULT: "var(--color-shadow-30)",
        },
        "text-primary": {
          DEFAULT: "var(--color-text-primary)",
        },
        "icons-outline": {
          DEFAULT: "var(--color-icons-outline)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
        },
        main: "#1B1D1C",
        "light-background": "#f5f6f7",
        "main-50": "#1B1D1C80",
        "main-25": "#1B1D1C33",
        "main-75": "#1b1d1cbf",
        "main-500": "#939496",
        green: "#02AB5B",
        "green-10": "#02AB5B1A",
        red: "#FF8092",
        "red-10": "#FF80921A",
        yellow: "#FFE56E",
      },
      fontSize: {
        "4.5xl": "40px",
        "3.5xl": "34px",
      },
    },
  },
  plugins: [],
} satisfies Config;
