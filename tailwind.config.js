/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm': {
          100: '#FFF1E6',
          200: '#FFE4D4',
          300: '#FFD5BB',
          400: '#FFC7A3',
          500: '#FFB88A',
        },
      },
    },
  },
  plugins: [],
}