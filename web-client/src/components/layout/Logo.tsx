import { Link } from 'react-router-dom';

export function Logo({ light = false, to = '/' }: { light?: boolean; to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
        <QMark />
      </span>
      <span
        className={`text-[17px] font-semibold tracking-tight ${light ? 'text-white' : 'text-ink'}`}
      >
        Qeue
      </span>
    </Link>
  );
}

function QMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="#4F46E5" strokeWidth="2.4" />
      <path d="M15 15l4.5 4.5" stroke="#4F46E5" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}
