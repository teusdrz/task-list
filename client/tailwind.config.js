/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Esta linha é CRUCIAL para o dark mode funcionar
  theme: {
    extend: {},
  },
  plugins: [],
}