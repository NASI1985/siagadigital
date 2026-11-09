// Warna dibaca dari variabel CSS di src/index.css supaya mode gelap otomatis ikut berganti.
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      screens: {
        two: '820px',
      },
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        subtle: token('subtle'),
        ink: token('ink'),
        'on-ink': token('on-ink'),
        muted: token('muted'),
        line: token('line'),
        brand: token('brand'),
        'brand-ink': token('brand-ink'),
        'brand-tint': token('brand-tint'),
        'brand-deep': token('brand-deep'),
        danger: token('danger'),
        'danger-ink': token('danger-ink'),
        'danger-tint': token('danger-tint'),
        notice: token('notice'),
        'notice-ink': token('notice-ink'),
        'mark-warn': token('mark-warn'),
        'mark-danger': token('mark-danger'),
        today: token('today'),
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(36px, 7vw, 64px)', { lineHeight: '1.04', letterSpacing: '-0.035em' }],
        title: ['clamp(24px, 3.2vw, 30px)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        eyebrow: ['12px', { lineHeight: '16px', letterSpacing: '0.1em' }],
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
};
