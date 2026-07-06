import { Link } from 'react-router-dom';

/** Plain lowercase wordmark — no glyph, the type is the brand. */
export function Logo({ to = '/', className = '' }: { light?: boolean; to?: string; className?: string }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-baseline text-[22px] font-semibold lowercase leading-none tracking-[-0.045em] text-ink transition-opacity hover:opacity-80 ${className}`}
    >
      qeue
      <span className="ml-0.5 inline-block h-[5px] w-[5px] rounded-full bg-accent" aria-hidden />
    </Link>
  );
}
