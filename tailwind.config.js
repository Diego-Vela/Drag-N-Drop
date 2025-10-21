/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './screens/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light Theme Colors (flat structure for easier usage)
        'light-primary': '#000000',         // Black for primary text (high contrast)
        'light-secondary': '#374151',       // Dark gray for secondary text
        'light-background': '#e2e8f0',      // Slightly darker blue-gray to complement navy
        'light-surface': '#1e3a8a',         // Sophisticated navy blue (much calmer)
        'light-border': '#1e40af',          // Slightly lighter navy border
        'light-accent': '#1d4ed8',          // Deep blue accent for highlights
        'light-success': '#059669',         // Green for success states
        'light-warning': '#d97706',         // Amber for warnings
        'light-error': '#dc2626',           // Red for errors
        'light-highlight': '#fef3c7',       // Light warm yellow background for units
        'light-highlight-text': '#92400e',  // Dark amber text for good contrast
        'light-highlight-accent': '#fcd34d', // Golden yellow accent/border
        
        // Dark Theme Colors (flat structure for easier usage)
        'dark-primary': '#f9fafb',       // Light gray for primary text
        'dark-secondary': '#9ca3af',     // Medium gray for secondary text
        'dark-background': '#111827',    // Very dark background
        'dark-surface': '#1f2937',       // Dark gray for cards/surfaces
        'dark-border': '#374151',        // Dark border color
        'dark-accent': '#60a5fa',        // Lighter blue accent for dark mode
        'dark-success': '#34d399',       // Lighter green for dark mode
        'dark-warning': '#fbbf24',       // Lighter amber for dark mode
        'dark-error': '#f87171',         // Lighter red for dark mode
        'dark-highlight': '#fbbf24/20',  // Light amber background for units (with opacity)
        'dark-highlight-text': '#fbbf24', // Bright amber text for good contrast
        'dark-highlight-accent': '#fbbf24', // Amber accent/border
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
