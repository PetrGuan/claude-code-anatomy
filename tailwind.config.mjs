/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bg': '#0a0a0f',
        'bg-card': '#14141f',
        'bg-border': '#1e1e2e',
        'text': '#e0e0e8',
        'text-secondary': '#8888a0',
        'accent-purple': '#6c63ff',
        'accent-cyan': '#22d3ee',
        'accent-amber': '#f59e0b',
        'accent-emerald': '#10b981',
        'accent-red': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
