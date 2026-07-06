import { Link, useNavigate, useParams } from 'react-router-dom';
import { Ticket, ClipboardList, ArrowRight, Building2 } from 'lucide-react';
import { eventsApi } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../lib/auth';
import {
  eventFormatLabel,
  eventStatusMeta,
  formatDate,
  formatTime,
  formatDateTime,
} from '../lib/format';
import type { Session, Speaker } from '../lib/types';
import { Container } from '../components/layout/Page';
import { EventBanner } from '../components/events/EventBanner';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { Button, ButtonLink } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingBlock, ErrorState, EmptyState } from '../components/ui/States';
import { SpeakerCard } from '../components/events/SpeakerCard';
import { AgendaList } from '../components/events/AgendaList';

export function EventDetailPage() {
  const { eventId = '' } = useParams();
  const { isAuthenticated, isAttendee } = useAuth();
  const navigate = useNavigate();

  const { data: event, loading, error, reload } = useApi(
    (s) => eventsApi.get(eventId, s),
    [eventId],
  );
  const { data: speakers } = useApi((s) => eventsApi.speakers(eventId, s), [eventId]);
  const { data: sessions } = useApi((s) => eventsApi.sessions(eventId, s), [eventId]);
  const { data: types } = useApi((s) => eventsApi.types(eventId, s), [eventId]);

  if (loading) return <LoadingBlock label="Loading event…" />;
  if (error || !event)
    return (
      <Container className="py-16">
        <ErrorState message={error ?? 'Event not found.'} onRetry={reload} />
      </Container>
    );

  const cancelled = event.status === 'CANCELLED';
  const activeTypes = (types ?? []).filter((t) => t.active).sort((a, b) => a.sortOrder - b.sortOrder);
  const publishedSpeakers = (speakers ?? []) as Speaker[];
  const publishedSessions = ((sessions ?? []) as Session[]).filter((s) => s.status !== 'DRAFT');

  const onRegister = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${eventId}/register` } });
    } else {
      navigate(`/events/${eventId}/register`);
    }
  };

  return (
    <div className="bg-paper pb-20">
      {/* Banner + title: flat, bordered, title on the page — not overlaid. */}
      <div className="border-b border-zinc-200 bg-surface">
        <Container className="pb-8 pt-8">
          <Link
            to="/events"
            className="mb-4 inline-flex items-center gap-1.5 font-mono text-[12px] text-zinc-500 hover:text-ink"
          >
            ← Back to events
          </Link>
          <div className="aspect-[21/8] w-full overflow-hidden rounded-lg border border-zinc-200">
            <EventBanner event={event} rounded="rounded-none" />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge className="border-accent/40 bg-accent-soft text-accent-ink">{event.category}</Badge>
            <Badge className="border-zinc-300 bg-zinc-100 text-zinc-600">
              {eventFormatLabel[event.eventFormat]}
            </Badge>
            {event.status !== 'PUBLISHED' && <StatusBadge meta={eventStatusMeta[event.status]} />}
          </div>
          <h1 className="mt-3 max-w-3xl text-[clamp(1.6rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-ink">
            {event.title}
          </h1>
        </Container>
      </div>

      <Container className="mt-8">
        {cancelled && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
            This event has been cancelled by the organizer.
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main column */}
          <div className="space-y-10">
            <section>
              <p className="microlabel mb-2">About</p>
              <h2 className="text-lg font-semibold text-ink">About this event</h2>
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-600">
                {event.description}
              </p>
            </section>

            {publishedSessions.length > 0 && (
              <section>
                <p className="microlabel mb-2">Agenda</p>
                <h2 className="mb-4 text-lg font-semibold text-ink">Sessions</h2>
                <AgendaList sessions={publishedSessions} timezone={event.timezone} />
              </section>
            )}

            {publishedSpeakers.length > 0 && (
              <section>
                <p className="microlabel mb-2">Speakers</p>
                <h2 className="mb-4 text-lg font-semibold text-ink">Who&rsquo;s speaking</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {publishedSpeakers.map((sp) => (
                    <SpeakerCard key={sp.id} speaker={sp} />
                  ))}
                </div>
              </section>
            )}

            {publishedSessions.length === 0 && publishedSpeakers.length === 0 && (
              <EmptyState
                icon={<ClipboardList className="h-6 w-6" />}
                title="Agenda coming soon"
                description="The organizer hasn't published sessions or speakers for this event yet."
              />
            )}
          </div>

          {/* Sticky registration panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden">
              <dl className="divide-y divide-zinc-200">
                <MetaRow label="Date">{formatDate(event.startsAt, event.timezone)}</MetaRow>
                <MetaRow label="Time">
                  {formatTime(event.startsAt, event.timezone)} –{' '}
                  {formatTime(event.endsAt, event.timezone)}
                  <span className="block font-mono text-[11px] text-zinc-400">{event.timezone}</span>
                </MetaRow>
                {event.eventFormat === 'ONLINE' ? (
                  <MetaRow label="Location">Online event</MetaRow>
                ) : (
                  <MetaRow label="Venue">
                    <span className="font-medium text-ink">{event.venueName}</span>
                    <span className="block text-xs text-zinc-500">
                      {event.venueAddress}, {event.venueCity}
                    </span>
                  </MetaRow>
                )}
                <MetaRow label="Capacity">
                  <span className="font-mono">{event.capacity}</span> attendees
                </MetaRow>
              </dl>

              {activeTypes.length > 0 && (
                <div className="border-t border-zinc-200 px-5 py-4">
                  <p className="microlabel mb-2.5">Registration types</p>
                  <ul className="space-y-2">
                    {activeTypes.map((t) => (
                      <li
                        key={t.id}
                        className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                      >
                        <div>
                          <p className="text-[13px] font-medium text-ink">{t.name}</p>
                          {t.description && <p className="text-[12px] text-zinc-500">{t.description}</p>}
                        </div>
                        <Badge className="border-zinc-300 bg-surface text-zinc-500">
                          {t.capacity} seats
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-zinc-200 p-5">
                {cancelled ? (
                  <Button disabled className="w-full" size="lg">
                    Registration closed
                  </Button>
                ) : !isAuthenticated ? (
                  <>
                    <Button
                      onClick={onRegister}
                      className="w-full"
                      size="lg"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Sign in to register
                    </Button>
                    <p className="mt-2.5 text-center text-[12px] text-zinc-400">
                      New here?{' '}
                      <Link to="/signup" className="font-medium text-accent hover:underline">
                        Create an account
                      </Link>
                    </p>
                  </>
                ) : isAttendee ? (
                  <Button
                    onClick={onRegister}
                    className="w-full"
                    size="lg"
                    leftIcon={<Ticket className="h-4 w-4" />}
                  >
                    Register for this event
                  </Button>
                ) : (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-[13px] text-zinc-500">
                    <Building2 className="mx-auto mb-1.5 h-4 w-4 text-zinc-400" />
                    You&rsquo;re signed in as an organizer. Switch to an attendee account to register.
                  </div>
                )}
              </div>
            </Card>

            <div className="mt-4 text-center">
              <ButtonLink to={`/events/${eventId}/survey`} variant="ghost" size="sm">
                Took part already? Leave feedback
              </ButtonLink>
            </div>

            <p className="mt-3 text-center font-mono text-[11px] text-zinc-400">
              Updated {formatDateTime(event.updatedAt)}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5">
      <dt className="microlabel mt-0.5 shrink-0">{label}</dt>
      <dd className="text-right text-[13px] text-zinc-600">{children}</dd>
    </div>
  );
}
