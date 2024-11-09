/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        success: colors.green,
        primary: colors.blue,
        'custom-color': '#8600e5', 
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
