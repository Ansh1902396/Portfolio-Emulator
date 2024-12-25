import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        cursor: 'cursor 1s step-end infinite',
        fadeIn: 'fadeIn 1s ease-in-out',
        slideIn: 'slideIn 0.2s ease-out',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        cursor: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': {
            textShadow: '0 0 10px #10B981, 0 0 20px #10B981',
          },
          '50%': {
            textShadow: '0 0 20px #10B981, 0 0 30px #10B981, 0 0 40px #10B981',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config

