module.exports = {
  content: ['src/**/*.{ts,html}', 'zigzag/projects/zigzag/src/lib/components/**/*.{ts,html}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
      },
      fontFamily: {
        heading: ['Caveat Brush', 'cursive'],
      },
      fontSize: {
        '8xl': '7rem',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
