import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '../ui/Button';
import { useAuth } from '../../lib/auth';

/* Fine engineering-grid backdrop drawn in CSS — no images, no shaders. */
const gridBg: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(22,22,26,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(22,22,26,0.055) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
};

const LIFECYCLE = [
  { step: '01', title: 'Draft', desc: 'Build the event: venue, schedule, capacity.' },
  { step: '02', title: 'Publish', desc: 'Go live and open registration.' },
  { step: '03', title: 'Register', desc: 'Capacity-safe. Never oversold.' },
  { step: '04', title: 'Check in', desc: 'Hashed ticket codes at the door.' },
  { step: '05', title: 'Measure', desc: 'Analytics, no-shows, surveys.' },
];

export function LandingHero() {
  const { isAuthenticated, isOrganizer } = useAuth();
  const primaryTo = !isAuthenticated
    ? '/signup'
    : isOrganizer
      ? '/organizer/events/new'
      : '/events';
  const primaryLabel = !isAuthenticated
    ? 'Get started free'
    : isOrganizer
      ? 'Create an event'
      : 'Find an event';

  return (
    <section className="relative border-b border-zinc-200 bg-paper" style={gridBg}>
      <div className="relative mx-auto flex max-w-7xl flex-col px-5 pb-14 pt-16 sm:px-8 sm:pb-16 sm:pt-20 lg:px-12 lg:pb-20 lg:pt-24">
        <CornerTicks />

        <p className="microlabel mb-6">Event operations platform</p>

        <h1 className="max-w-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-ink text-[clamp(2.2rem,7vw,4.75rem)]">
          Run events people
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          actually <span className="text-accent">show up</span> to.
        </h1>

        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-600 sm:text-base">
          Build and publish events, register attendees without overselling, issue tickets, check
          people in, and measure it all — from one exact workspace.
        </p>

        <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ButtonLink to={primaryTo} size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
            {primaryLabel}
          </ButtonLink>
          <ButtonLink to="/events" size="lg" variant="outline">
            Browse live events
          </ButtonLink>
        </div>

        {/* Lifecycle strip: the product, stated as a pipeline. */}
        <div className="mt-16 overflow-hidden rounded border border-zinc-200 bg-zinc-200">
          <ol className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-5">
            {LIFECYCLE.map((s) => (
              <li key={s.step} className="bg-white p-4">
                <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-accent">
                  {s.step}
                </p>
                <h3 className="mt-2 text-[14px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-[12px] leading-snug text-zinc-500">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
          Draft → Publish → Register → Check in → Measure —{' '}
          <Link to="/events" className="text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-ink">
            see what&rsquo;s live
          </Link>
        </p>
      </div>
    </section>
  );
}

/* Crosshair ticks marking the hero's grid corners — the "precision" signature. */
function CornerTicks() {
  return (
    <svg
      className="pointer-events-none absolute right-5 top-16 hidden text-zinc-300 sm:right-8 lg:right-12 lg:block"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
