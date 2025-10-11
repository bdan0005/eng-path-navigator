/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite/**/*.js",
    "node_modules/flowbite-react/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
             'blue': '#0064AC',
             'light-blue': '#bcd9eeac',
             'success-25': '#F6FEF9',
             'success-100': '#D1FADF',
             'success-300': '#6CE9A6',
             'success-700': '#027A48'
             },
        },
        fontFamily: {
          inter: ['Inter', 'sans-serif'],
        },
    },
  plugins: [
    require('flowbite/plugin'),
  ],
  safelist: [
    'min-h-[70px]',
  ],
}