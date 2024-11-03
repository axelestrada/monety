/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}",  "./src/components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#1B1D1C",
        "light-background": "#f5f6f7",
        "main-50": "#1B1D1C80",
        "main-25": "#1B1D1C33",
        "main-75": "#1b1d1cbf",
        "main-500": "#939496",
        green: "#02AB5B",
        "green-10": "#02AB5B1A",
        red: "#FF8092",
        accent: "#FF2883",
        "dark-accent": "#f43385",
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
};
