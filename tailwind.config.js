/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
          deep: '#3b020d',
          darkest: '#2a0108',
        },
        navy: {
          950: '#4c0519',
          900: '#580b1c',
          800: '#700c24',
          700: '#881337',
        },
        brand: {
          blue: '#881337',
          hover: '#700c24',
          light: '#FFF1F2',
          maroon: '#800000',
        },
        slate: {
          50: '#FDFBFB',
          100: '#F8F4F5',
          200: '#EBE2E4',
          300: '#D5C7CA',
          400: '#9E8D91',
          500: '#6E5D61',
          600: '#504144',
          700: '#3D3133',
          800: '#281E20',
          900: '#1A1214',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(76, 5, 25, 0.05), 0 1px 2px 0 rgba(76, 5, 25, 0.03)',
        'card': '0 1px 3px 0 rgba(42, 1, 8, 0.06), 0 1px 2px -1px rgba(42, 1, 8, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(42, 1, 8, 0.08), 0 2px 4px -2px rgba(42, 1, 8, 0.05)',
      }
    },
  },
  plugins: [],
}
