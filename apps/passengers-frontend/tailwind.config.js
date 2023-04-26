/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    transitionDuration: {
      DEFAULT: '300ms',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    extend: {
      fontFamily: {
        NeueMetanaNext: ['NeueMetanaNext', 'sans-serif'],
        NeueMetanaNextOutline: ['NeueMetanaNextOutline', 'poppins'],
      },
      colors: {
        // TODO: Expand the colors
        'primary-blue': '#00f0ff',
        'primary-dark': '#80818D',
        error: '#FF3A83',
        warning: '#FEB113',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};
