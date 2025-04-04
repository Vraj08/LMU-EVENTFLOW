/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        "primary-foreground": "#ffffff",
        accent: "#f3f4f6",
        "accent-foreground": "#1f2937",
        "muted-foreground": "#6b7280",
      },
      animation: {
        'fade-in-out': 'fadeInOut 3s ease-in-out forwards',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: 0, transform: 'translateY(-10px)' },
          '10%, 90%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
