import type { Config } from "tailwindcss";
import { APP_COLORS } from "./constants/colors"; // Path check garnuhola (src vitra chha vane)

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
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
      // --- YO SECTION THAPIYO (For Loading Animation) ---
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      // -----------------------------------------------
    },
  },
  plugins: [],
};

export default config;