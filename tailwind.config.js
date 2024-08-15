/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#1B1D1C",
        "main-50": "#1B1D1C80",
        "main-500": "#939496",
        green: "#3FE671",
        "green-10": "#3FE6711A",
        red: "#FF8092",
        "red-10": "#FF80921A",
        yellow: "#FFE56E"
      },
      fontSize: {
        "4.5xl": "40px",
      },
    },
  },
  plugins: [],
};
