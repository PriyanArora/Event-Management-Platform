/**
 * Aesthetic direction — "Precision Grid"
 * Utilitarian / confident / exact.
 * - Type: Space Grotesk (display + body), IBM Plex Mono for data & labels.
 * - Color: cool-neutral. Paper #FAFAF9, ink #16161A, zinc ramp for neutrals.
 *   One accent: electric indigo (#4F46E5 family). Used for interaction
 *   signals (links, active states, focus), not decoration.
 * - Density: airy on public pages, tight in the organizer console.
 * - Radius: 4px. Borders over shadows; a single popover shadow level.
 * - Motion: quiet. 200ms ease on state changes only.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF9',
        ink: {
          DEFAULT: '#16161A',
          soft: '#55555E',
        },
        accent: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          soft: '#EEF0FE',
          ink: '#3730A3',
        },
      },
      fontFamily: {
        sans: [
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
        // Single elevation level, reserved for popovers/modals/toasts.
        pop: '0 8px 24px rgba(22, 22, 26, 0.12)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
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
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease both',
        'scale-in': 'scale-in 0.2s ease both',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.32,0.72,0,1) both',
      },
    },
  },
  plugins: [],
}
