/**
 * Aesthetic direction — "Signal Dark"
 * Raycast-style: near-black canvas, glass surfaces, one hot accent.
 * - Type: Instrument Sans (body), Space Grotesk (wordmark/buttons), IBM Plex
 *   Mono for data & labels.
 * - Color: dark-first. Paper #0A0A0B canvas, glass panels, electric-blue accent
 *   (#5B8CFF family) for interaction signals and glow. The `zinc` ramp is
 *   REMAPPED for dark: low numbers = raised dark surfaces/borders, high
 *   numbers = light text. Semantics ("zinc-500 is muted text", "zinc-200 is
 *   a border") are preserved from the old light theme, so components keep
 *   reading naturally.
 * - Status ramps (red/emerald/amber) are likewise dark-tuned: 50–300 are
 *   translucent tints/borders, 400+ are readable light tones.
 * - Radius: soft (8–16px). Hairline white borders over hard shadows.
 * - Motion: quiet. 200ms ease on state changes; slow glow drift on the hero.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#0A0A0B',
        surface: {
          DEFAULT: '#141416',
          raised: '#1A1A1E',
        },
        ink: {
          DEFAULT: '#F5F5F7',
          soft: '#9C9CA6',
        },
        accent: {
          DEFAULT: '#5B8CFF',
          hover: '#7AA2FF',
          soft: 'rgba(91, 140, 255, 0.12)',
          ink: '#A9C4FF',
        },
        zinc: {
          50: '#18181B',
          100: '#1F1F23',
          200: '#28282D',
          300: '#38383F',
          400: '#6E6E78',
          500: '#8E8E99',
          600: '#B1B1BA',
          700: '#D2D2D8',
          800: '#E8E8EC',
          900: '#F5F5F7',
        },
        red: {
          50: 'rgba(255, 99, 99, 0.08)',
          100: 'rgba(255, 99, 99, 0.16)',
          200: 'rgba(255, 99, 99, 0.3)',
          300: 'rgba(255, 99, 99, 0.45)',
          400: '#FF8585',
          500: '#FF6B6B',
          600: '#FF5252',
          700: '#FF9C9C',
          800: '#FFB8B8',
        },
        emerald: {
          50: 'rgba(52, 211, 153, 0.08)',
          100: 'rgba(52, 211, 153, 0.16)',
          200: 'rgba(52, 211, 153, 0.3)',
          300: 'rgba(52, 211, 153, 0.45)',
          400: '#4ADEA8',
          500: '#34D399',
          600: '#10B981',
          700: '#6EE7B7',
          800: '#A7F3D0',
        },
        amber: {
          50: 'rgba(251, 191, 36, 0.08)',
          100: 'rgba(251, 191, 36, 0.16)',
          200: 'rgba(251, 191, 36, 0.3)',
          300: 'rgba(251, 191, 36, 0.45)',
          400: '#FCD34D',
          500: '#FBBF24',
          600: '#F59E0B',
          700: '#FCD34D',
          800: '#FDE68A',
        },
      },
      fontFamily: {
        // Body: Helvetica-style grotesque. Display: the wordmark face,
        // used by the logo and buttons.
        sans: [
          '"Instrument Sans Variable"',
          '"Instrument Sans"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '"Space Grotesk Variable"',
          '"Space Grotesk"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"IBM Plex Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      boxShadow: {
        // Elevation for popovers/modals/toasts on a dark canvas.
        pop: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        // Accent glow for primary CTAs and hero elements.
        glow: '0 0 32px rgba(91, 140, 255, 0.35)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.98)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'glow-drift': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(4%, -3%) scale(1.06)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease both',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.2s ease both',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.32,0.72,0,1) both',
        'glow-drift': 'glow-drift 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
