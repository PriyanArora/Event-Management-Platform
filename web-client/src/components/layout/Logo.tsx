import { Link } from 'react-router-dom';

/** Plain lowercase wordmark — no glyph, the type is the brand. */
export function Logo({ to = '/', className = '' }: { to?: string; className?: string }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-baseline font-display text-[22px] font-semibold lowercase leading-none tracking-[-0.045em] text-ink transition-opacity hover:opacity-80 ${className}`}
    >
      qeue
    </Link>
  );
}
