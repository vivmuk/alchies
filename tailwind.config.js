/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Indigo 500
        secondary: '#14b8a6', // Teal 500
        accent: '#a855f7', // Purple 500
        background: '#f3f4f6',
        'dark-background': '#0f172a', // Slate 900
        'dark-card': '#1e293b', // Slate 800
        'dark-surface': '#334155', // Slate 700
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      spacing: {
        '2': '0.5rem',
        '4': '1rem',
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.primary"), 0 0 20px theme("colors.primary")',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
          },
        },
      },
    },
    fontFamily: {
      sans: ['Inter var', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    }
  },
  plugins: [],
  darkMode: 'class',
} 