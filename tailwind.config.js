/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Theme Colors
        light: {
          primary: '#1f2937',      // Dark gray for primary elements
          secondary: '#6b7280',    // Medium gray for secondary text
          background: '#ffffff',   // Pure white background
          surface: '#f9fafb',      // Light gray for cards/surfaces
          border: '#e5e7eb',       // Light border color
          accent: '#3b82f6',       // Professional blue accent
          success: '#10b981',      // Green for success states
          warning: '#f59e0b',      // Amber for warnings
          error: '#ef4444',        // Red for errors
        },
        // Dark Theme Colors
        dark: {
          primary: '#f9fafb',      // Light gray for primary text
          secondary: '#9ca3af',    // Medium gray for secondary text
          background: '#111827',   // Very dark background
          surface: '#1f2937',      // Dark gray for cards/surfaces
          border: '#374151',       // Dark border color
          accent: '#60a5fa',       // Lighter blue accent for dark mode
          success: '#34d399',      // Lighter green for dark mode
          warning: '#fbbf24',      // Lighter amber for dark mode
          error: '#f87171',        // Lighter red for dark mode
        },
        // Neutral grays (work in both themes)
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'business': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'business-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'business-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
