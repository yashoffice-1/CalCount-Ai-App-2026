/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(16,24,40,0.10), 0 1px 2px rgba(16,24,40,0.06)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -12px rgba(15,23,42,0.18)',
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
      },
      colors: {
        border: 'hsl(var(--border))',
        bg: 'hsl(var(--background))',
        text: 'hsl(var(--foreground))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        ring: 'hsl(var(--ring))',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
