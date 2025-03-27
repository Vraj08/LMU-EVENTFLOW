/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
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
