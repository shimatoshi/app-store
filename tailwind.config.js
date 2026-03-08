/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'google-blue': '#1a73e8',
        'google-gray': '#5f6368',
      }
    },
  },
  plugins: [],
}
