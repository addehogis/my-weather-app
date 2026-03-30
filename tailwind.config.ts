import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      sm:   '640px',
      md:   '768px',
      lg:   '1024px',
      xl:   '1280px',
      '2xl':'1536px',
      '3xl':'1920px',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['10rem',  { lineHeight: '1' }],
        '11xl': ['12rem',  { lineHeight: '1' }],
        '12xl': ['16rem',  { lineHeight: '1' }],
        '13xl': ['20rem',  { lineHeight: '1' }],
      },
    },
  },
  plugins: [],
} satisfies Config
