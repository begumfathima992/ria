/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#fff7f7', 100: '#fde8ea', 200: '#f7cdd2', 300: '#eca5ae',
          400: '#df7180', 500: '#c94759', 600: '#aa2f43', 700: '#8f2132',
          800: '#731d2b', 900: '#5f1b27', 950: '#330b13'
        },
        champagne: '#d7b46f',
        cream: '#fbf7f1',
        pearl: '#f4ede6',
        ink: '#181416',
        sage: '#a9b8ae'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Iowan Old Style', 'Baskerville', 'Times New Roman', 'serif'],
        sans: ['Manrope', 'Avenir Next', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        luxe: '0 28px 75px rgba(53, 12, 20, 0.14)',
        card: '0 14px 40px rgba(23, 20, 22, 0.09)',
        soft: '0 9px 30px rgba(23, 20, 22, 0.06)'
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at 75% 22%, rgba(215,180,111,.28), transparent 34%), radial-gradient(circle at 9% 82%, rgba(143,33,50,.16), transparent 31%)',
        'wine-glow': 'radial-gradient(circle at 78% 15%, rgba(215,180,111,.18), transparent 34%), linear-gradient(135deg,#330b13 0%,#641d2a 100%)'
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { '0%': { transform: 'translateX(-130%)' }, '100%': { transform: 'translateX(130%)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(26px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pageIn: { '0%': { opacity: '.72', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        safeReveal: { '0%': { opacity: '.72', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        pulseSoft: { '0%,100%': { opacity: '.45', transform: 'scale(1)' }, '50%': { opacity: '.72', transform: 'scale(1.05)' } }
      },
      animation: {
        float: 'float 5.5s ease-in-out infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'fade-up': 'fadeUp .7s cubic-bezier(.22,1,.36,1) both',
        'page-in': 'pageIn .35s ease-out both',
        'safe-reveal': 'safeReveal .65s cubic-bezier(.22,1,.36,1) both',
        marquee: 'marquee 25s linear infinite',
        'pulse-soft': 'pulseSoft 5s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
