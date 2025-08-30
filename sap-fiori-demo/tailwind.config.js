/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'sap-shell': '#ffffff',
        'sap-text': '#1d2d3e',
        'sap-button-emphasized': '#0070f2',
        'sap-background': '#f5f6f7',
      },
      fontFamily: {
        '72': ['72', '72full', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 