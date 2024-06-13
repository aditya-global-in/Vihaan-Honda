/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'vihaan-honda-red': '#e20612',
        'vihaan-honda-red-darker': '#af040d',
      },
    },
  },
  plugins: [],
};
