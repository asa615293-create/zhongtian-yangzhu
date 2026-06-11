/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#1C1C1E',
        'bg-secondary': '#2C2C2E',
        'bg-card': '#3A3A3C',
        'bg-hover': '#48484A',
        'text-primary': '#F5F0EB',
        'text-secondary': '#A8A8AD',
        'text-muted': '#6E6E73',
        'accent': '#C4A265',
        'accent-hover': '#D4B275',
        'accent-muted': 'rgba(196, 162, 101, 0.15)',
        'brown': '#5C4A3A',
        'border-subtle': 'rgba(255, 255, 255, 0.08)',
        'success': '#34C759',
        'warning': '#FF9F0A',
        'error': '#FF3B30',
      },
      fontFamily: {
        'display': ['Cormorant Garamond', 'serif'],
        'body': ['DM Sans', 'system-ui', 'sans-serif'],
        'cn': ['"Source Han Sans SC"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
