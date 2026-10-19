import animate from 'tailwindcss-animate';

const withAlpha = (variable) => `hsl(var(${variable}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: withAlpha('--border'),
        input: withAlpha('--input'),
        ring: withAlpha('--ring'),
        background: withAlpha('--background'),
        foreground: withAlpha('--foreground'),
        primary: { DEFAULT: withAlpha('--primary'), foreground: withAlpha('--primary-foreground') },
        secondary: { DEFAULT: withAlpha('--secondary'), foreground: withAlpha('--secondary-foreground') },
        destructive: { DEFAULT: withAlpha('--destructive'), foreground: withAlpha('--destructive-foreground') },
        muted: { DEFAULT: withAlpha('--muted'), foreground: withAlpha('--muted-foreground') },
        accent: { DEFAULT: withAlpha('--accent'), foreground: withAlpha('--accent-foreground') },
        card: { DEFAULT: withAlpha('--card'), foreground: withAlpha('--card-foreground') },
        popover: { DEFAULT: withAlpha('--popover'), foreground: withAlpha('--popover-foreground') },
        // התנגשות 409: אדום בולט (color-error-conflict)
        conflict: { DEFAULT: withAlpha('--conflict'), foreground: withAlpha('--conflict-foreground') },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: ['Rubik', 'Heebo', 'Segoe UI', 'system-ui', 'sans-serif'],
        sans: ['Heebo', 'Segoe UI', 'system-ui', '-apple-system', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 18px hsl(var(--primary) / 0.45)',
        conflict: '0 0 18px hsl(var(--conflict) / 0.45)',
      },
      keyframes: {
        // תנועה איטית לאיורי הכרטיסים בלובי (מושבתת ב-prefers-reduced-motion)
        'aurora-a': {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '100%': { transform: 'translate3d(120px, 90px, 0) scale(1.15)' },
        },
        'aurora-b': {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1.1)' },
          '100%': { transform: 'translate3d(-140px, -60px, 0) scale(0.9)' },
        },
        breathe: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.04)' },
        },
        'bubble-in': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // התוכן "יוצא" מתוך מרכז הבועה
        emerge: {
          '0%': { clipPath: 'circle(0% at 50% 50%)' },
          '100%': { clipPath: 'circle(150% at 50% 50%)' },
        },
        // אותיות הלוגו: קפיצה פנימה, ואז גל איטי
        'letter-in': {
          '0%': { transform: 'translateY(36px) scale(0.5) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1) rotate(0)', opacity: '1' },
        },
        'letter-wave': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(6px, -8px, 0)' },
        },
        // האנימציה רצה על הכפתור הפנימי. ה-transform של העטיפה נקבע ב-requestAnimationFrame
        'box-pop': {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'box-pop': 'box-pop 0.18s ease-out',
        emerge: 'emerge 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'letter-in': 'letter-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'letter-wave': 'letter-wave 2.4s ease-in-out infinite',
        drift: 'drift 5s ease-in-out infinite alternate',
        'aurora-a': 'aurora-a 18s ease-in-out infinite alternate',
        'aurora-b': 'aurora-b 22s ease-in-out infinite alternate',
        breathe: 'breathe 3.5s ease-in-out infinite alternate',
        'bubble-in': 'bubble-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [animate],
};
