/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'bg-auth': "url('src/assets/img/bgauth.jpg')",
        'bg-hero': "url('src/assets/img/bghero.png')",
      }
    },
  },
  plugins: [],
}

