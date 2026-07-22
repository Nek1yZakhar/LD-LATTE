/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ld-bg-primary': '#FAF7F2',
        'ld-bg-secondary': '#F3EDE2',
        'ld-bg-elevated': '#FFFFFF',
        'ld-bg-tertiary': '#EBE3D5',
        'ld-text-primary': '#161210',
        'ld-text-secondary': '#4A3E39',
        'ld-text-muted': '#8C7C75',
        'ld-accent': '#48121A',
        'ld-accent-hover': '#6B1D2E',
        'ld-accent-subtle': '#F7EFF1',
        'ld-border-default': '#D4C4B7',
        'ld-border-subtle': '#E8E0D7',
        'ld-status-success': '#2E6B48',
        'ld-status-success-bg': '#EAF3EC',
        'ld-status-warning': '#B57F22',
        'ld-status-warning-bg': '#FAF3E6',
        'ld-status-error': '#A83B2B',
        'ld-status-error-bg': '#F9ECE9',
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "-apple-system", "sans-serif"],
        display: ["'Outfit'", "-apple-system", "sans-serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(22, 18, 16, 0.04)',
        'accent': '0 8px 20px -4px rgba(200, 141, 116, 0.35)',
      }
    },
  },
  plugins: [],
};
