/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000042',
          50: '#e8e8f5',
          100: '#c5c5e8',
          200: '#9e9edb',
          300: '#7777ce',
          400: '#5555c4',
          500: '#3333ba',
          600: '#2a2aad',
          700: '#1e1e9c',
          800: '#12128a',
          900: '#000042',
        },
        teal: {
          DEFAULT: '#00BAC6',
          50: '#e0f8f9',
          100: '#b3eef1',
          200: '#80e3e9',
          300: '#4dd8e1',
          400: '#26d0da',
          500: '#00c8d4',
          600: '#00BAC6',
          700: '#00a7b2',
          800: '#00939e',
          900: '#006f78',
        },
        gold: '#f5a623',
        accent: '#ffd700',
        lkgreen: '#329c92',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 66, 0.08)',
        'card-hover': '0 10px 40px rgba(0, 0, 66, 0.15)',
        nav: '0 2px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
