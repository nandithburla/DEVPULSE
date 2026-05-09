/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#030712',
          900: '#07111f',
          850: '#0a1424',
          800: '#111827',
          700: '#1f2937'
        },
        pulse: {
          cyan: '#22d3ee',
          blue: '#38bdf8',
          green: '#34d399',
          amber: '#fbbf24',
          red: '#fb7185'
        }
      },
      boxShadow: {
        glow: '0 0 28px rgba(34, 211, 238, 0.16)',
        panel: '0 24px 80px rgba(0, 0, 0, 0.35)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace']
      }
    }
  },
  plugins: []
};
