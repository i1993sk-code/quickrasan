/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blinkit: '#0c831f',
        'blinkit-light': '#f0fff4',
        'blinkit-dark': '#076e17',
      }
    },
  },
  plugins: [],
}