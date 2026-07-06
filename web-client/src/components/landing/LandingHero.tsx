import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '../ui/Button';
import { DitherShader } from '../ui/DitherShader';
import { FlipWords } from '../ui/FlipWords';
import { useAuth } from '../../lib/auth';

const LIFECYCLE = [
  { title: 'Draft', desc: 'Build the event: venue, schedule, capacity.' },
  { title: 'Publish', desc: 'Go live and open registration.' },
  { title: 'Register', desc: 'Capacity-safe. Never oversold.' },
  { title: 'Check in', desc: 'Hashed ticket codes at the door.' },
  { title: 'Measure', desc: 'Analytics, no-shows, surveys.' },
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
      {/* Dithered conference crowd in brand duotone, fading into the page canvas. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <DitherShader
          src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2670&auto=format&fit=crop"
          gridSize={3}
          ditherMode="bayer"
          colorMode="duotone"
          primaryColor="#0A0A0B"
          secondaryColor="#44639F"
          threshold={0.5}
          animated={false}
          className="h-full w-full"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,10,11,0.6) 0%, rgba(10,10,11,0.45) 45%, #0A0A0B 100%)',
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 pb-16 pt-20 text-center sm:px-8 sm:pt-28 lg:pb-24">
        <h1 className="max-w-3xl animate-fade-in-up font-semibold leading-[1.04] tracking-[-0.035em] text-ink text-[clamp(2.5rem,7vw,4.5rem)]">
          Run events people actually{' '}
          {/* Real product flows only: registration, check-in, attendance. */}
          <FlipWords
            words={['show up to', 'register for', 'check in to']}
            className="text-accent"
          />
        </h1>

        <p
          className="mt-6 max-w-xl animate-fade-in-up text-[15px] leading-relaxed text-zinc-500 sm:text-base"
          style={{ animationDelay: '160ms' }}
        >
          Build and publish events, register attendees without overselling, issue tickets, check
          people in, and measure it all from one fast workspace.
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
                key={s.title}
                className="rounded-xl p-4 text-left transition-colors hover:bg-white/[0.05]"
              >
                <h3 className="text-[14px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-[12px] leading-snug text-zinc-500">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
