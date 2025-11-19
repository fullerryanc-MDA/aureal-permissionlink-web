import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Aureal Brand Colors
        'aureal-gold': '#C8A240',
        'aureal-dark': '#1F262A',
        'aureal-slate': '#0F172A',
        'aureal-card': '#1F2937',
        'aureal-green': '#4CAF50',
        'aureal-blue': '#6BA3D8',
        'aureal-text-primary': '#F1F5F9',
        'aureal-text-secondary': '#94A3B8',
        'aureal-text-muted': '#64748B',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
