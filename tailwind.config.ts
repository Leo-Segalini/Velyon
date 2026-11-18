import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFAE2',
        ink: '#26291E',
        sage: '#5C614D',
        palm: '#92977E',
        gold: '#E6E18F',
        custard: '#FEFCAD',
        line: '#EADDA6',
        paper: '#FFFFFF',
        card: '#FFFDF5',
        danger: '#8E2E2A',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { container: '80rem' },
      borderRadius: { sm: '8px', md: '12px' },
      boxShadow: { card: '0 4px 20px rgba(38, 41, 30, 0.05)' },
    },
  },
  plugins: [],
}

export default config
