/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.3' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      fontFamily: {
        sans: ['Righteous', 'cursive', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        ripple: 'ripple 600ms linear',
      },
    },
  },
  plugins: [],
}