/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festive: {
          dark: '#0d0f18',
          card: '#161926',
          border: '#2a2f45',
          gold: '#fbbf24',
          goldLight: '#fef08a',
          red: '#ef4444',
          redDark: '#991b1b',
          orange: '#f97316',
          emerald: '#10b981',
        }
      },
      animation: {
        'sparkle': 'sparkle 1.5s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        sparkle: {
          '0%': { transform: 'scale(0.95) rotate(-2deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1.05) rotate(2deg)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
