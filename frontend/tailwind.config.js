/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        slate: {
          850: '#151f32',
          950: '#0b1120',
        }
      },
      boxShadow: {
        'card-soft': '0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'float-lg': '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
        'glow-emerald-soft': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
        'glow-blue-soft': '0 0 20px -3px rgba(59, 130, 246, 0.25)',
        'glow-amber-soft': '0 0 20px -3px rgba(245, 158, 11, 0.25)',
        'glow-purple-soft': '0 0 20px -3px rgba(139, 92, 246, 0.25)',
      },
    },
  },
  plugins: [],
}
