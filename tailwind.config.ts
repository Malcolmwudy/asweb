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
        primary: {
          DEFAULT: '#DC2626', // 红色主题色（对应 Android Material3 primary）
          light: '#EF4444',
          dark: '#B91C1C',
        },
      },
    },
  },
  plugins: [],
}
export default config

