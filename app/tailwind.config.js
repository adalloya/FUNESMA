/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          dark: '#030712',
          card: '#0f172a',
          accent: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
