module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'planet-red': {
          DEFAULT: '#E31D1B',
          50: '#FCE8E8',
          100: '#F9D1D0',
          200: '#F4A3A2',
          300: '#EF7573',
          400: '#E94745',
          500: '#E31D1B',
          600: '#B41715',
          700: '#851110',
          800: '#570B0A',
          900: '#290505',
        },
        'planet-black': {
          DEFAULT: '#0B0B0B',
          50: '#E0E0E0',
          100: '#B0B0B0',
          200: '#808080',
          300: '#505050',
          400: '#303030',
          500: '#0B0B0B',
          600: '#090909',
          700: '#070707',
          800: '#050505',
          900: '#020202',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
        'slide-in-right': 'slideInRight 0.5s ease-in-out',
        'scale-up': 'scaleUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};