/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        site: {
          bg:     '#D3D8DA', // rgb(211, 216, 218)
          text:   '#0F3D6E', // rich saturated navy blue — main headings & body
          muted:  '#5A6E7A', // medium grayish blue — secondary text
          subtle: '#8099A6', // lighter — labels, footer
          border: '#B0BCC2', // slightly darker than bg — dividers & card borders
        },
      },
    },
  },
  plugins: [],
};
