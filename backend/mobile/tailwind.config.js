/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3F3D9C',
        accent: '#8F8CE7'
      }
    },
  },
  plugins: [],
}

