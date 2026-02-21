/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background
        'cream': '#F7F4EF',
        // Card Surface
        'card': '#FFFFFF',
        // Primary Accent
        'primary': '#C86A4A',
        // Secondary Accent
        'secondary': '#6A8F7B',
        // Text
        'text-primary': '#2E2E2E',
        'text-secondary': '#6B6B6B',
        'text-muted': '#B5B5B5',
        // Borders
        'border': '#E5E2DD',
        // Semantic
        'award': '#C9A227',
        'favorite': '#D45C5C',
        'danger': '#B94A48',
        'action': '#555555',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['28px', { fontWeight: '600' }],
        'modal-title': ['22px', { fontWeight: '500' }],
        'section-title': ['20px', { fontWeight: '500' }],
        'card-title': ['18px', { fontWeight: '500' }],
        'body': ['15px', { fontWeight: '400' }],
        'meta': ['13px', { fontWeight: '400' }],
        'button': ['14px', { fontWeight: '500' }],
      },
      spacing: {
        'card-padding': '16px',
        'card-padding-lg': '20px',
        'grid-gap': '16px',
        'section': '24px',
        'section-lg': '32px',
      },
      borderRadius: {
        'card': '16px',
        'modal': '20px',
        'button': '12px',
        'pill': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0,0,0,0.06)',
        'modal': '0 12px 40px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};