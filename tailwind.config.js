/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#2A2725',
        'bg-secondary': '#363230',
        'bg-card': '#43403D',
        'bg-hover': '#514D49',
        'text-primary': '#F5F0EB',
        'text-secondary': '#C4BDB4',
        'text-muted': '#918981',
        'accent': '#C4A265',
        'accent-hover': '#D4B275',
        'accent-muted': 'rgba(196, 162, 101, 0.18)',
        'brown': '#5C4A3A',
        'border-subtle': 'rgba(255, 255, 255, 0.12)',
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
