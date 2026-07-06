import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { eventsApi } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { LandingHero } from '../components/landing/LandingHero';
import { Container } from '../components/layout/Page';
import { EventCard, EventCardSkeleton } from '../components/events/EventCard';
import { ButtonLink } from '../components/ui/Button';
import { EmptyState, ErrorState } from '../components/ui/States';

const FEATURES = [
  { title: 'Event builder', desc: 'Format, category, banner, venue, timezone, schedule, capacity — with a draft, publish, and cancel lifecycle.' },
  { title: 'Registration forms', desc: 'Custom questions and registration types with per-type capacity enforcement.' },
  { title: 'Tickets', desc: 'Every confirmed attendee gets a ticket with a securely hashed code.' },
  { title: 'Check-in', desc: 'Key in ticket codes at the door and track who actually showed up.' },
  { title: 'Analytics', desc: 'Capacity, confirmations, cancellations, check-ins, no-shows, and type breakdowns.' },
  { title: 'Surveys', desc: 'Publish post-event surveys and collect attendee responses.' },
  { title: 'Speakers & agenda', desc: 'Add speakers and build a multi-session agenda mapped to rooms.' },
  { title: 'Notifications', desc: 'Templated emails fire on registration and check-in events.' },
];

export function LandingPage() {
  const { data: events, loading, error, reload } = useApi(
    (signal) => eventsApi.listPublished(signal),
    [],
  );
  const upcoming = (events ?? [])
    .slice()
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt))
    .slice(0, 6);

  return (
    <>
      <LandingHero />

      {/* Upcoming events */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="microlabel mb-2">01 — Happening soon</p>
              <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Upcoming events
              </h2>
            </div>
            <Link
              to="/events"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent-ink"
            >
              View all events
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={reload} />
          ) : upcoming.length === 0 ? (
            <EmptyState
              title="No published events yet"
              description="Once organizers publish events, they'll appear here for everyone to browse."
              action={<ButtonLink to="/signup" size="sm">Become an organizer</ButtonLink>}
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Features — glass grid: the index and the words do the work. */}
      <section className="relative border-y border-white/[0.06] py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 80% 10%, rgba(91,140,255,0.06), transparent 65%)',
          }}
        />
        <Container className="relative">
          <div className="max-w-2xl">
            <p className="microlabel mb-2">02 — One platform, end to end</p>
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
              Everything you need to run an event
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              From the first draft to the post-event survey, qeue covers the whole lifecycle so you
              never duct-tape five tools together again.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="glass group rounded-xl p-5 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-[15px] font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Split audience CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <AudienceCard
              tone="accent"
              eyebrow="For organizers"
              title="Launch your next event in minutes"
              points={['Build & publish events', 'Manage attendees & check-in', 'Track live analytics']}
              cta={{ label: 'Start organizing', to: '/signup' }}
            />
            <AudienceCard
              tone="glass"
              eyebrow="For attendees"
              title="Find events and keep your tickets in one place"
              points={['Register in a few clicks', 'Access tickets anytime', 'Take post-event surveys']}
              cta={{ label: 'Browse events', to: '/events' }}
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function AudienceCard({
  tone,
  eyebrow,
  title,
  points,
  cta,
}: {
  tone: 'accent' | 'glass';
  eyebrow: string;
  title: string;
  points: string[];
  cta: { label: string; to: string };
}) {
  const accent = tone === 'accent';
  return (
    <div
      className="glass glass-edge relative flex flex-col justify-between gap-8 overflow-hidden rounded-2xl p-8 sm:p-10"
    >
      {accent && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 90% at 15% 0%, rgba(91,140,255,0.18), transparent 65%)',
          }}
        />
      )}
      <div className="relative">
        <p className="microlabel">{eyebrow}</p>
        <h3 className="mt-3 max-w-sm text-2xl font-semibold tracking-tight text-ink">{title}</h3>
        <ul className="mt-5 space-y-2">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-sm text-zinc-600">
              <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <ButtonLink
        to={cta.to}
        variant={accent ? 'accent' : 'primary'}
        className="relative w-fit"
        rightIcon={<ArrowRight className="h-4 w-4" />}
      >
        {cta.label}
      </ButtonLink>
    </div>
  );
}
