// src/constants/colors.ts
export const APP_COLORS = {
  primary: "#0891B2",      // Cyan-600
  accent: "#1877F2",       // Facebook Blue
  background: "#F0F2F5",   // Facebook Gray
  textMain: "#050505",     // Black
  textMuted: "#65676B",    // Gray
  success: "#22C55E",      // Green
} as const;

// 🔥 Social Store Specific Colors
export const SOCIAL_COLORS = {
  facebook: {
    blue: "#1877F2",
    bg: "#F0F2F5",
    card: "#FFFFFF",
    hover: "#E4E6EB",
    text: "#050505",
    secondary: "#65676B"
  },
  stn: {
    cyan: "#0891B2",
    dark: "#0E7490"
  }
} as const;