import type { Config } from "tailwindcss";

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
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
        "shadow": {
          "30": "var(--color-shadow-30)",
          "50": "var(--color-shadow-50)",
        },
        "text-primary": {
          DEFAULT: "var(--color-text-primary)",
          "75": "var(--color-text-primary-75)",
          "40": "var(--color-text-primary-40)",
        },
        "icons-outline": {
          DEFAULT: "var(--color-icons-outline)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          "50": "var(--color-accent-50)",
        },
        "card-background": {
          DEFAULT: "var(--color-card-background)",
        },
        "icon-button-background": {
          DEFAULT: "var(--color-icon-button-background)",
        },
        "modal-background": {
          DEFAULT: "var(--color-modal-background)",
        },
        income: {
          DEFAULT: "var(--color-income)",
        },
        expense: {
          DEFAULT: "var(--color-expense)",
        },
        "chip-background": {
          DEFAULT: "var(--color-chip-background)",
        },
        "icon-primary": {
          DEFAULT: "var(--color-icon-primary)",
        },
        "text-secondary": {
          DEFAULT: "var(--color-text-secondary)",
        },
        "text-white": {
          DEFAULT: "var(--color-text-white)",
        },
        error: {
          DEFAULT: "var(--color-error)",
        },
        "separator": {
          DEFAULT: "var(--color-separator)",
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
        "3.5xl": "30px",
        xs: "10px",
      },
    },
  },
  plugins: [],
} satisfies Config;
