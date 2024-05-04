module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
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
    },
  },
  plugins: ['@tailwindcss/forms'],
}

