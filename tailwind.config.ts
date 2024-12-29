import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens:{
      '2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xxl': {'max': '1460px'},
      // => @media (max-width: 1460px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'halfxl': {'max': '1172px'},
      // => @media (max-width: 1172px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'halflg': {'max': '860px'},
      // => @media (max-width: 860) { ... }

      'md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }

      'ss': {'max': '500px'},
      // => @media (max-width: 500px) { ... }

      'xs': {'max': '430px'},
      // => @media (max-width: 430px) { ... }

      'se': {'max': '430px'},
      // => @media (max-width: 430px) { ... }

      'ylg': { 'raw': '(max: 1023px)'},
      // => @media (min-width: 1023px) { ... }

      'tall': { 'raw': '(max-height: 800px)' },
      // => @media (min-height: 800px) { ... }

      'lgtall': { 'raw': '(max-height: 750px)' },
      // => @media (min-height: 750px) { ... }

      'mdtall': { 'raw': '(max-height: 650px)' },
      // => @media (min-height: 650px) { ... }

      'mini': { 'raw': '(max-height: 550px)' },
      // => @media (min-height: 550) { ... }

      'iphonese': { 'raw': '(max-width: 400px) and (max-height: 600px)' },

      'mdandtall': { 'raw': '(max-width: 1500px) and (max-height: 800px)' },

      'mdandtallimit': { 'raw': '(max-width: 768px) and (max-height: 800px)' },


      'iphone4': { 'raw': '(max-width: 320px) and (max-height: 480px)' },


      'largetall': { 'raw': '(max-width: 850px) and (max-height: 750px)' },

      'mediumtall': { 'raw': '(max-width: 639px) and (max-height: 800px)' },

      'smmini': { 'raw': '(max-width: 639px) and (max-height: 550px)' },

      'halflgylg': { 'raw': '(max-width: 860px) and (max-height: 1023px)' },

      'xsymd': { 'raw': '(max-width: 430px) and (max-height: 767px)' },

      'halfxlysm': { 'raw': '(max-width: 1172px) and (max-height: 639px)' },

      'xlyhalflg': { 'raw': '(max-width: 1280px) and (max-height: 860px)' },

      'halflgyhalflg': { 'raw': '(max-width: 860px) and (max-height: 860px)' },

      'mdymd': { 'raw': '(max-width: 767px) and (max-height: 767px)' },











    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'hero-pattern': "url('/bg.png')",
        'tech-bg': "url('/tech.png')",
      },
      keyframes: {
        shine: {
          '0%': { 
            opacity: '0.5',
            transform: 'translateX(-100px) skewX(-15deg)',
            transitionProperty: 'opacity, transform',
          },
          '50%': { 
            opacity: '0.6',
            transform: 'translateX(300px) skewX(-15deg)',
            transitionProperty: 'opacity, transform',
          },
          '100%': { 
            opacity: '0.6',
            transform: 'translateX(300px) skewX(-15deg)',
            transitionProperty: 'opacity, transform',
          },
        },
        shine2: {
          '0%': { 
            opacity: '0.5',
            transform: 'translateX(-300px) skewX(-15deg)',
            transitionProperty: 'opacity, transform',
          },
          '50%': { 
            opacity: '0.6',
            transform: 'translateX(400px) skewX(-15deg)',
            transitionProperty: 'opacity, transform',
          },
          '100%': { 
            opacity: '0.6',
            transform: 'translateX(500px) skewX(-15deg)',
            transitionProperty: 'opacity, transform',
          },
        },
        typing: {
          '0%' : { 
            width:'0%' 
          },
          '20%': {
            width:'100%'
          },
          '100%': { 
            width:'100%' 
          }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        shine: 'shine 3s linear infinite',
        shine2: 'shine2 3s linear infinite',
        typing: 'typing 20s  steps(25, end) forwards', // Customize duration and steps as needed
        blink: 'blink 1s step-end infinite',
      }
    },
  },
  plugins: [],
};
export default config;