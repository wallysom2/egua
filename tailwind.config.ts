import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontSize: {
        'base': '1.125rem',
        'lg': '1.25rem',
        'xl': '1.5rem',
        '2xl': '1.875rem',
        '3xl': '2.25rem',
        '4xl': '2.75rem',
        '5xl': '3.25rem',
        '6xl': '4rem',
      },
      fontFamily: {
        sans: [
          'var(--font-geist-sans)',
          ...fontFamily.sans
        ]
      },
      borderRadius: {
        'lg': '1rem',
        'md': '0.75rem',
        'sm': '0.5rem'
      },
      spacing: {
        'button': '3.5rem',
        'icon': '2.5rem',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#1a5fb4',
          hover: '#1552a0',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#2ec27e',
          hover: '#26a269',
          foreground: '#ffffff'
        },
        accent: {
          DEFAULT: '#e66100',
          hover: '#c01c28',
          foreground: '#ffffff'
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#202020'
        },
        muted: {
          DEFAULT: '#f6f6f6',
          foreground: '#666666'
        },
        border: '#e0e0e0',
        input: '#f0f0f0',
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
