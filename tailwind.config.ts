import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#ffffff",
            foreground: "#000000",
            primary: {
              DEFAULT: "#0a0a0a",
              foreground: "#fafafa",
            },
            secondary: {
              DEFAULT: "#f5f5f5",
              foreground: "#0a0a0a",
            },
            success: {
              DEFAULT: "#18c964",
              foreground: "#fafafa",
            },
            warning: {
              DEFAULT: "#f5a524",
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#f31260",
              foreground: "#fafafa",
            },
          },
        },
        dark: {
          colors: {
            background: "#000000",
            foreground: "#fafafa",
            primary: {
              DEFAULT: "#e5e5e5",
              foreground: "#0a0a0a",
            },
            secondary: {
              DEFAULT: "#262626",
              foreground: "#fafafa",
            },
            success: {
              DEFAULT: "#18c964",
              foreground: "#000000",
            },
            warning: {
              DEFAULT: "#f5a524",
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#f31260",
              foreground: "#fafafa",
            },
          },
        },
      },
    }),
  ],
};

export default config;