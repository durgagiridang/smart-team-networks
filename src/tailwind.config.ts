import type { Config } from "tailwindcss";

// 🔥 Facebook-style Colors + तपाईंको App Colors
const APP_COLORS = {
  // Primary Brand Colors
  primary: "#0891B2",      // Cyan-600 (STN Brand)
  accent: "#1877F2",       // Facebook Blue
  background: "#F0F2F5",   // Facebook Gray Background
  
  // Text Colors
  textMain: "#050505",     // Almost Black
  textMuted: "#65676B",    // Facebook Gray Text
  
  // Status Colors
  success: "#22C55E",      // Green
  warning: "#F59E0B",      // Orange
  danger: "#EF4444",       // Red
  
  // Facebook Specific
  fb: {
    blue: "#1877F2",
    green: "#42B72A",
    bg: "#F0F2F5",
    card: "#FFFFFF",
    hover: "#E4E6EB",
    text: "#050505",
    secondary: "#65676B",
    border: "#CED0D4"
  }
};

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // तपाईंको Original Colors
        primary: APP_COLORS.primary,
        accent: APP_COLORS.accent,
        'app-bg': APP_COLORS.background,
        'text-main': APP_COLORS.textMain,
        'text-muted': APP_COLORS.textMuted,
        success: APP_COLORS.success,
        
        // 🔥 Facebook-style Colors (Social Store को लागि)
        facebook: {
          blue: "#1877F2",
          green: "#42B72A",
          bg: "#F0F2F5",
          card: "#FFFFFF",
          hover: "#E4E6EB",
          active: "#E7F3FF",
          text: "#050505",
          secondary: "#65676B",
          border: "#CED0D4",
          link: "#385898"
        },
        
        // 🔥 STN Brand Colors
        stn: {
          cyan: "#0891B2",
          dark: "#0E7490",
          light: "#67E8F9",
          bg: "#ECFEFF"
        }
      },
      
      // 🔥 Custom Animations
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        slideIn: 'slideIn 0.3s ease-out',
        fadeIn: 'fadeIn 0.2s ease-out'
      },
      
      // 🔥 Background Gradient for Shimmer
      backgroundImage: {
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
      
      // 🔥 Custom Shadows (Facebook-style)
      boxShadow: {
        'fb': '0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
        'fb-hover': '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 2px rgba(0, 0, 0, 0.2)',
        'story': '0 2px 8px rgba(0, 0, 0, 0.2)'
      },
      
      // 🔥 Border Radius (Facebook-style)
      borderRadius: {
        'fb': '8px',
        'fb-lg': '12px',
        'fb-full': '50%'
      },
      
      // 🔥 Font Family
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      
      // 🔥 Spacing (Facebook uses 8px grid)
      spacing: {
        'fb': '8px',
        'fb-2': '16px',
        'fb-3': '24px',
      }
    },
  },
  
  // 🔥 Plugins
  plugins: [
    // Custom Plugin for Scrollbar Hide
    function({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        }
      });
    }
  ],
};

export default config;