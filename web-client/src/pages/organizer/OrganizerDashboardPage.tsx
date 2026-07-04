import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, MapPin, ArrowUpRight } from 'lucide-react';
import { organizerApi } from '../../lib/api';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../lib/auth';
import { eventFormatLabel, eventStatusMeta, formatDate, formatTime } from '../../lib/format';
import { Container, PageHeader } from '../../components/layout/Page';
import { Stat } from '../../components/ui/Stat';
import { ButtonLink } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { EventBanner } from '../../components/events/EventBanner';
import { LoadingBlock, ErrorState, EmptyState } from '../../components/ui/States';

export function OrganizerDashboardPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi((s) => organizerApi.listEvents(s), []);

  const stats = useMemo(() => {
    const list = data ?? [];
    return {
      total: list.length,
      published: list.filter((e) => e.status === 'PUBLISHED').length,
      drafts: list.filter((e) => e.status === 'DRAFT').length,
      capacity: list.reduce((sum, e) => sum + (e.capacity || 0), 0),
    };
  }, [data]);

  const sorted = (data ?? []).slice().sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt));

  return (
    <div className="bg-paper py-10 sm:py-14">
      <Container>
        <PageHeader
          eyebrow="Organizer"
          title={`Welcome back, ${user?.displayName?.split(' ')[0] ?? 'organizer'}`}
          description="Create events, manage attendees, and track turnout."
          actions={
            <ButtonLink to="/organizer/events/new" leftIcon={<CalendarPlus className="h-4 w-4" />}>
              Create event
            </ButtonLink>
          }
        />

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="All events" value={stats.total} />
          <Stat label="Published" value={stats.published} />
          <Stat label="Drafts" value={stats.drafts} />
          <Stat label="Total capacity" value={stats.capacity} />
        </div>

        <h2 className="microlabel mb-4">Your events</h2>

        {loading ? (
          <LoadingBlock />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={<CalendarPlus className="h-6 w-6" />}
            title="No events yet"
            description="Create your first event to start collecting registrations."
            action={<ButtonLink to="/organizer/events/new" size="sm">Create your first event</ButtonLink>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sorted.map((e) => (
              <Link
                key={e.id}
                to={`/organizer/events/${e.id}`}
                className="group flex flex-col overflow-hidden rounded border border-zinc-200 bg-white transition-colors duration-200 hover:border-ink"
              >
                <div className="relative h-28 overflow-hidden border-b border-zinc-200">
                  <EventBanner event={e} rounded="rounded-none" />
                  <div className="absolute left-3 top-3">
                    <StatusBadge meta={eventStatusMeta[e.status]} />
                  </div>
                  <span className="absolute right-3 top-3 rounded-sm bg-ink px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-white">
                    {eventFormatLabel[e.eventFormat]}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-[15px] font-semibold text-ink group-hover:text-accent">
                      {e.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-300 transition-colors group-hover:text-accent" />
                  </div>
                  <div className="mt-2.5 flex flex-col gap-1 text-[12px] text-zinc-500">
                    <span className="font-mono">
                      {formatDate(e.startsAt, e.timezone)} · {formatTime(e.startsAt, e.timezone)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="truncate">
                        {e.eventFormat === 'ONLINE' ? 'Online' : `${e.venueName}, ${e.venueCity}`}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
