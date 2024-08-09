/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#1B1D1C",
        "main-500": "#939496",
        yellow: "#FFE56E",
        green: "#3FE671",
        "green-10": "#3FE6711A",
        red: "#FF8092",
        "red-10": "#FF80921A"
      },
      fontSize: {
        "4.5xl": "40px",
      },
    },
  },
  plugins: [],
};
