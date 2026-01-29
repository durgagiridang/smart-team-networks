import type { Config } from "tailwindcss";
import { APP_COLORS } from "./constants/colors"; // Path check: src/constants मा छ भने यस्तो हुन्छ

const config: Config = {
  // content मा app, components र src सबै समेट्नुपर्छ
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: APP_COLORS.primary,
        accent: APP_COLORS.accent,
        'app-bg': APP_COLORS.background,
        'text-main': APP_COLORS.textMain,
        'text-muted': APP_COLORS.textMuted,
        success: APP_COLORS.success,
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};

export default config;