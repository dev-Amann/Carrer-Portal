/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          start: '#6EE7B7',
          end: '#3B82F6',
        },
        accent: '#8B5CF6',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
