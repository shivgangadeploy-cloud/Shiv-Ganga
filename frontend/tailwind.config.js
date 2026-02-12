// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-sand': '#F9F7F2',       // Card Background
        'sacred-saffron': '#FF9933',  // Icons
        'deep-ganges': '#0F2A44',     // Title & Overlay
        'charcoal-black': '#333333',  // Description
        'warm-gold': '#D4AF37',       // Accent Line
        'accent': '#D4AF37',          // Keeping your existing accent
        'primary': '#0F2A44',         // Keeping your existing primary
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'], // Assuming you use a serif font for titles like the image
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
