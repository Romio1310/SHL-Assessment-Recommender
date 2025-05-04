/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./templates/**/*.html', './static/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',  // Slightly enhanced for better contrast
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        'secondary': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        'accent': {
          50: '#fdf4ff',
          100: '#fae8ff', 
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',  // Enhanced for better contrast
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        // Enhanced vibrant colors for better contrast
        'vibrant': {
          'blue': '#3b82f6',
          'blue-dark': '#2563eb',
          'purple': '#8b5cf6',
          'purple-dark': '#7c3aed',
          'pink': '#ec4899',
          'pink-dark': '#db2777',
          'orange': '#f97316',
          'orange-dark': '#ea580c',
          'teal': '#14b8a6',
          'teal-dark': '#0d9488',
          'lime': '#84cc16',
          'lime-dark': '#65a30d',
          'amber': '#f59e0b',
          'amber-dark': '#d97706',
          'emerald': '#10b981',
          'emerald-dark': '#059669',
          'red': '#ef4444',
          'red-dark': '#dc2626',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
        'display': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'dark-card': '0 10px 15px -3px rgba(6, 8, 24, 0.7), 0 4px 6px -2px rgba(6, 8, 24, 0.5)',
        'dark-card-hover': '0 20px 25px -5px rgba(6, 8, 24, 0.7), 0 10px 10px -5px rgba(6, 8, 24, 0.6)',
        'glow': '0 0 15px rgba(99, 102, 241, 0.5)',
        'dark-glow': '0 0 15px rgba(139, 92, 246, 0.5)',
        'button-glow': '0 0 15px rgba(99, 102, 241, 0.7)',
        'accent-glow': '0 0 15px rgba(217, 70, 239, 0.7)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}