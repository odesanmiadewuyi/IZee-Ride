/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'System']
      },
      colors: {
        brand: {
          DEFAULT: '#2F62F0',
          dark: '#1F3FB2',
          light: '#E7EEFF'
        }
      }
    },
  },
  plugins: [],
}
