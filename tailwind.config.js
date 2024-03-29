/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false
  },
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      textOpacity: ['dark']
    }
  },
  plugins: []
};
