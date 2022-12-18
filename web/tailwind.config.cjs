/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        secondary: ["Secular One", "sans-serif"],
      },
      container: {
				screens: {
					"sm": "640px",
					"md": "768px",
					"lg": "1024px",
					"xl": "1024px",
					"2xl": "1024px"
				}
			},
    },
  },
  plugins: [],
}
