import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { eventsApi } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { LandingHero } from '../components/landing/LandingHero';
import { MacbookScroll } from '../components/ui/MacbookScroll';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/ui/Carousel';
import { Container } from '../components/layout/Page';
import { EventCard, EventCardSkeleton } from '../components/events/EventCard';
import { ButtonLink } from '../components/ui/Button';
import { EmptyState, ErrorState } from '../components/ui/States';

const FEATURES = [
  { title: 'Event builder', desc: 'Format, category, banner, venue, timezone, schedule, and capacity, with a draft, publish, and cancel lifecycle.' },
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

      {/* Scroll-driven MacBook showcase: the lid opens onto the app itself. */}
      <section className="overflow-hidden">
        <MacbookScroll
          title={
            <span>
              From draft to check-in.
              <br />
              One workspace.
            </span>
          }
          src="/macbook-screen.png"
          showGradient={false}
        />
      </section>

      {/* Upcoming events */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Upcoming events
            </h2>
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

      {/* Features: glass grid, the words do the work. */}
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
            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
              Everything you need to run an event
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              From the first draft to the post-event survey, qeue covers the whole lifecycle so you
              never duct-tape five tools together again.
            </p>
          </div>

          {/* Feature cards slide sideways (embla via shadcn Carousel). */}
          <Carousel opts={{ align: 'start' }} className="mt-10">
            <CarouselContent className="-ml-3">
              {FEATURES.map((f) => (
                <CarouselItem key={f.title} className="pl-3 sm:basis-1/2 lg:basis-1/3">
                  <div className="glass group h-full rounded-xl p-6 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06]">
                    <h3 className="text-[15px] font-semibold text-ink">{f.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{f.desc}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-top-12 left-auto right-10 translate-y-0" />
            <CarouselNext className="-top-12 left-auto right-0 translate-y-0" />
          </Carousel>
        </Container>
      </section>

    </>
  );
}
