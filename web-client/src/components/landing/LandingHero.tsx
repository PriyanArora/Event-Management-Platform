import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '../ui/Button';
import { useAuth } from '../../lib/auth';

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
    <section className="relative overflow-hidden">
      {/* Aurora glow: drifting accent blooms behind the headline. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[-30%] h-[70vh] w-[120vw] -translate-x-1/2 animate-glow-drift"
          style={{
            background:
              'radial-gradient(ellipse 55% 60% at 50% 30%, rgba(91,140,255,0.22), transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute left-[15%] top-[10%] h-[50vh] w-[60vw] animate-glow-drift"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(124,90,255,0.1), transparent 70%)',
            filter: 'blur(60px)',
            animationDelay: '-7s',
          }}
        />
        {/* Fine grid, faded toward the edges. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black 30%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 35%, black 30%, transparent 75%)',
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 pb-16 pt-16 text-center sm:px-8 sm:pt-24 lg:pb-24">
        <Link
          to="/events"
          className="glass animate-fade-in-up rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-600 transition-colors hover:text-ink"
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
          Event operations platform
        </Link>

        <h1
          className="mt-8 max-w-3xl animate-fade-in-up font-semibold leading-[1.04] tracking-[-0.035em] text-ink text-[clamp(2.5rem,7vw,4.5rem)]"
          style={{ animationDelay: '80ms' }}
        >
          Run events people actually{' '}
          <span className="bg-gradient-to-r from-accent via-[#8FB0FF] to-[#C4D6FF] bg-clip-text text-transparent">
            show up
          </span>{' '}
          to.
        </h1>

        <p
          className="mt-6 max-w-xl animate-fade-in-up text-[15px] leading-relaxed text-zinc-500 sm:text-base"
          style={{ animationDelay: '160ms' }}
        >
          Build and publish events, register attendees without overselling, issue tickets, check
          people in, and measure it all — from one fast workspace.
        </p>

        <div
          className="mt-9 flex animate-fade-in-up flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: '240ms' }}
        >
          <ButtonLink to={primaryTo} size="lg" variant="accent" rightIcon={<ArrowRight className="h-4 w-4" />}>
            {primaryLabel}
          </ButtonLink>
          <ButtonLink to="/events" size="lg" variant="outline">
            Browse live events
          </ButtonLink>
        </div>

        {/* Lifecycle strip: the product, stated as a pipeline, on glass. */}
        <div
          className="glass glass-edge mt-16 w-full animate-fade-in-up rounded-2xl p-2 sm:mt-20"
          style={{ animationDelay: '320ms' }}
        >
          <ol className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-5">
            {LIFECYCLE.map((s) => (
              <li
                key={s.step}
                className="rounded-xl p-4 text-left transition-colors hover:bg-white/[0.05]"
              >
                <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-accent">
                  {s.step}
                </p>
                <h3 className="mt-2 text-[14px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-[12px] leading-snug text-zinc-500">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
