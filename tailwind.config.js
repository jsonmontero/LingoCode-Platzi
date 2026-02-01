/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        'primary-glow': 'rgba(139, 92, 246, 0.5)',
        secondary: '#06D6A0',
        'secondary-glow': 'rgba(6, 214, 160, 0.5)',
        accent: '#FF6B6B',
        'accent-glow': 'rgba(255, 107, 107, 0.4)',
        yellow: '#FFE66D',
        dark: '#0D0D1A',
        'card-bg': 'rgba(255, 255, 255, 0.05)',
        border: 'rgba(255, 255, 255, 0.1)',
        'text-muted': 'rgba(255, 255, 255, 0.6)',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}