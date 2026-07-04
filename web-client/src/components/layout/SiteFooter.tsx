import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Build, publish, and run events end to end — registration, tickets, check-in,
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
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 pt-6 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
            © {new Date().getFullYear()} Qeue
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
            A learning portfolio project
          </p>
        </div>
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
