/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#060b1b',
          soft: '#0d1430',
          glass: '#111a3b',
        },
        primary: {
          400: '#8b5cf6',
          500: '#7c3aed',
          600: '#6366f1',
        },
        accent: {
          cyan: '#22d3ee',
          violet: '#a78bfa',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 15% 20%, rgba(124,58,237,0.35) 0%, transparent 45%), radial-gradient(circle at 75% 25%, rgba(34,211,238,0.28) 0%, transparent 45%), linear-gradient(130deg, #060b1b 10%, #0d1430 45%, #111a3b 100%)',
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(88, 70, 255, 0.35)',
        card: '0 20px 45px rgba(5, 9, 28, 0.45)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(34,211,238,0.0)' },
          '50%': { boxShadow: '0 0 30px rgba(34,211,238,0.35)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'pulseGlow 3s ease-in-out infinite',
        gradient: 'gradientShift 10s ease infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
        'scale-pulse': 'scale-pulse 4s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'glow-expand': 'glow-expand 3s ease-in-out infinite',
        'particle-float': 'particle-float 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
