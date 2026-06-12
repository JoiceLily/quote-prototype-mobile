import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        app: '#f5f7fb',
        surface: '#ffffff',
        muted: '#667085',
        line: '#e4e7ec',
      },
      boxShadow: {
        mobile: '0 8px 24px rgba(16, 24, 40, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config
