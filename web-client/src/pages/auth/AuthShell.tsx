import type { ReactNode } from 'react';
import { Logo } from '../../components/layout/Logo';

/** Two-pane auth layout: form on the left, glowing brand panel on the right. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-paper lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Logo />
        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-sm py-10">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
            <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden border-l border-white/[0.06] lg:block">
        {/* Aurora bloom + fine grid, matching the landing hero. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute right-[-20%] top-[-10%] h-[70%] w-[90%] animate-glow-drift"
            style={{
              background:
                'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(91,140,255,0.16), transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              maskImage: 'radial-gradient(ellipse 80% 80% at 70% 30%, black 20%, transparent 80%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 80% at 70% 30%, black 20%, transparent 80%)',
            }}
          />
        </div>

        <div className="relative flex h-full flex-col justify-between p-14">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            Event operations platform
          </p>
          <div>
            <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-ink">
              The exact way to build, publish, and run your events.
            </h2>
            <ol className="mt-8 space-y-3">
              {[
                'Publish events and never oversell capacity',
                'Issue tickets and check attendees in at the door',
                'Measure turnout with live analytics and surveys',
              ].map((p, i) => (
                <li key={p} className="flex items-center gap-3 text-sm text-zinc-600">
                  <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {p}
                </li>
              ))}
            </ol>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
            © {new Date().getFullYear()} qeue
          </p>
        </div>
      </div>
    </div>
  );
}
