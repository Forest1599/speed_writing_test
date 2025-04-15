/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Added some custom colours
  theme: {
    extend: {
      colors: {
        darkred: '#8B0000',
        darkredhover: '#A52A2A',
        gray: {
          700: '#3A3A3A',
          800: '#2E2E2E',
        },
      },
    },
  },
  plugins: [],
}