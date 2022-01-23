module.exports = {
  content: ['src/**/*.{ts,html}', 'zigzag/projects/zigzag/src/lib/components/**/*.{ts,html}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
