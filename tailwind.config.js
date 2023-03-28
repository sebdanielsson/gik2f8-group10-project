/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        1680: "1680px",
        1920: "1920px",
      },
    },
  },
  plugins: [],
};
