/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Bungee: ["Bungee Spice", "sans-serif"],
        Lemon: ["Lemon", "serif"],
        Pacifico: ["Pacifico", "  system-ui"],
        Rubik: ["Rubik Doodle Shadow", "serif"],
        Salsa: ["Salsa", " cursive"],
      },
      colors: {
        "olive-green": "#606c38",
        "dark-olive": "#283618",
        cream: "#fefae0",
        "golden-yellow": "#dda15e",
        "burnt-orange": "#bc6c25",
      },
    },
  },
  plugins: ['@tailwindcss/forms'],
}

