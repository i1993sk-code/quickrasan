/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B5E20',
        'primary-light': '#E8F5E9',
        'primary-dark': '#0D3B0F',
        blinkit: '#1B5E20',
        'blinkit-light': '#E8F5E9',
        'blinkit-dark': '#0D3B0F',
        accent: '#FF8F00',
        'accent-light': '#FFF8E1',
        'accent-dark': '#E65100',
      },
    },
  },
  plugins: [],
}
