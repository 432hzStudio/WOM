/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0faff',
          100: '#e0f5fe',
          200: '#bae8fd',
          300: '#7dd4fc',
          400: '#38b6f8',
          500: '#0e98e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          50: '#fff9eb',
          100: '#ffefc6',
          200: '#ffe099',
          300: '#ffca5d',
          400: '#ffb733',
          500: '#ff9500',
          600: '#e67700',
          700: '#bf5c00',
          800: '#9a4a09',
          900: '#7e3e0e',
          950: '#451d00',
        },
        dark: {
          50: '#f5f7fa',
          100: '#e9edf5',
          200: '#d0d9e8',
          300: '#a5b7d4',
          400: '#7690b9',
          500: '#5573a0',
          600: '#415b85',
          700: '#36496c',
          800: '#2f3e5c',
          900: '#2a364f',
          950: '#1a223a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
} 