/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
             'blue': '#0064AC',
             'light-blue': '#bcd9eeac',
             'gray': '#1F2429',
             'light-gray': '#C5CBD1',
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
  plugins: [],
  safelist: [
    'min-h-[70px]',
  ],
}