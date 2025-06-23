/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ensure this includes your file paths
  ],
  theme: {
    extend: {
      colors: {
        /* Semantic color tokens based on your :root variables */
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        popover: "hsl(var(--popover) / <alpha-value>)",
        "popover-foreground": "hsl(var(--popover-foreground) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "hsl(var(--secondary-foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",
        destructive: "hsl(var(--destructive) / <alpha-value>)",
        "destructive-foreground": "hsl(var(--destructive-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",

        /* Custom brand colors for wave animation and gradients */
        "music-purple": "#9c27b0",
        "music-blue": "#2196f3",
        "music-gold": "#ffca28",
      },
      

      /* Optional – use CSS variable for radius if needed */
      borderRadius: {
        lg: "var(--radius)",
      },
       keyframes: {
    wave: {
      '0%': { transform: 'scaleY(0.2)' },
      '50%': { transform: 'scaleY(1)' },
      '100%': { transform: 'scaleY(0.2)' }
    }
  },
  animation: {
    'wave-1': 'wave 1.2s linear infinite',
    'wave-2': 'wave 1.2s linear infinite 0.2s',
    'wave-3': 'wave 1.2s linear infinite 0.4s',
    'wave-4': 'wave 1.2s linear infinite 0.6s'
  }
    },
  },
  plugins: [],
}
