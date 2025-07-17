/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Jakarta: ["Jakarta", "sans-serif"],
        JakartaBold: ["Jakarta-Bold", "sans-serif"],
        JakartaExtraBold: ["Jakarta-ExtraBold", "sans-serif"],
        JakartaExtraLight: ["Jakarta-ExtraLight", "sans-serif"],
        JakartaLight: ["Jakarta-Light", "sans-serif"],
        JakartaMedium: ["Jakarta-Medium", "sans-serif"],
        JakartaSemiBold: ["Jakarta-SemiBold", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#F5E6FF", // Very Light Purple
          200: "#E6CCFF", // Light Purple
          300: "#CC99FF", // Medium Light Purple
          400: "#B266FF", // Medium Purple
          500: "#8A00C4", // Neon Purple (Main Color)
          600: "#7800A8", // Darker Neon Purple
          700: "#66008C", // Dark Purple
          800: "#550070", // Very Dark Purple
          900: "#440054", // Deep Purple
        },
        secondary: {
          100: "#FFF0F5", // Very Light Pink (complements purple)
          200: "#FFE4EC", // Light Pink
          300: "#FFB6C1", // Medium Light Pink
          400: "#FF8A9B", // Medium Pink
          500: "#FF5C75", // Bright Pink
          600: "#E6445E", // Darker Pink
          700: "#B23347", // Dark Pink
          800: "#8A2636", // Very Dark Pink
          900: "#611925", // Deep Pink
        },
        success: {
          100: "#F0FFF4", // Very Light Green
          200: "#C6F6D5", // Light Green
          300: "#9AE6B4", // Medium Light Green
          400: "#68D391", // Medium Green
          500: "#38A169", // Green
          600: "#2F855A", // Dark Green
          700: "#276749", // Darker Green
          800: "#22543D", // Very Dark Green
          900: "#1C4532", // Deep Dark Green
        },
        danger: {
          100: "#FFF5F5", // Very Light Red
          200: "#FED7D7", // Light Red
          300: "#FEB2B2", // Medium Light Red
          400: "#FC8181", // Medium Red
          500: "#F56565", // Red
          600: "#E53E3E", // Bright Red
          700: "#C53030", // Dark Red
          800: "#9B2C2C", // Darker Red
          900: "#742A2A", // Very Dark Red
        },
        warning: {
          100: "#FFFBEB", // Very Light Yellow
          200: "#FEF3C7", // Light Yellow
          300: "#FDE68A", // Medium Light Yellow
          400: "#FACC15", // Bright Yellow
          500: "#EAB308", // Yellow
          600: "#CA8A04", // Dark Yellow
          700: "#A16207", // Darker Yellow
          800: "#854D0E", // Deep Yellow/Orange
          900: "#713F12", // Dark Brown
        },
        general: {
          100: "#E6E6FA", // Very Light Lavender (complements purple)
          200: "#D3D3D3", // Light Gray
          300: "#B0C4DE", // Light Slate Blue (complements purple)
          400: "#708090", // Medium Slate Gray
          500: "#F8F8FF", // Ghost White (neutral)
          600: "#E0FFFF", // Light Cyan (complements purple)
          700: "#C0C0C0", // Silver (neutral)
          800: "#696969", // Dim Gray
        },
      },
    },
  },
  plugins: [],
};