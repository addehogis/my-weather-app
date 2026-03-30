import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sun: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        ember: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        warm: {
          white:  '#fefce8',
          cream:  '#fef9ee',
          ink:    '#1c1917',
          muted:  '#78716c',
          border: '#d6d3d1',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm:  '0.375rem',
        md:  '0.625rem',
        lg:  '0.875rem',
        xl:  '1.25rem',
        '2xl': '1.75rem',
      },
      boxShadow: {
        brutal:     '4px 4px 0px 0px #1c1917',
        'brutal-sm': '2px 2px 0px 0px #1c1917',
        'brutal-lg': '8px 8px 0px 0px #1c1917',
        warm:       '0 4px 24px 0 rgba(251, 191, 36, 0.18)',
      },
    },
  },
  plugins: [],
} satisfies Config
