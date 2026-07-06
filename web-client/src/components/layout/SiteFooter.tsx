import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-paper">
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Build, publish, and run events end to end: registration, tickets, check-in,
              analytics, and surveys in one place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-2">
            <FooterCol
              title="Product"
              links={[
                ['Browse events', '/events'],
                ['Create an event', '/organizer/events/new'],
                ['Organizer dashboard', '/organizer'],
              ]}
            />
            <FooterCol
              title="Account"
              links={[
                ['Sign in', '/login'],
                ['Get started', '/signup'],
                ['My tickets', '/my/registrations'],
              ]}
            />
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
            © {new Date().getFullYear()} qeue
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
            A learning portfolio project
          </p>
        </div>
      </div>

      {/* Oversized ghost wordmark bleeding off the bottom edge. */}
      <div
        aria-hidden
        className="pointer-events-none select-none text-center font-semibold lowercase leading-[0.72] tracking-[-0.05em] text-white/[0.03]"
        style={{ fontSize: 'clamp(6rem, 22vw, 20rem)', marginBottom: '-0.14em' }}
      >
        qeue
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="microlabel">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map(([label, to]) => (
          <li key={label + to}>
            <Link to={to} className="text-[13px] text-zinc-500 transition-colors hover:text-ink">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
