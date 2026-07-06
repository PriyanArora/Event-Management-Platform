import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import type { EventSummary } from '../../lib/types';
import { dateParts, eventFormatLabel, formatTime } from '../../lib/format';
import { EventBanner } from './EventBanner';

export function EventCard({ event }: { event: EventSummary }) {
  const { month, day } = dateParts(event.startsAt, event.timezone);
  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-surface transition-colors duration-200 hover:border-ink"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-zinc-200">
        <EventBanner event={event} rounded="rounded-none" />
        <span className="absolute right-3 top-3 rounded bg-ink px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-paper">
          {eventFormatLabel[event.eventFormat]}
        </span>
      </div>
      <div className="flex flex-1 gap-4 p-4">
        {/* Date block: mono, exact. */}
        <div className="flex w-12 shrink-0 flex-col items-center border-r border-zinc-200 pr-4 pt-0.5 font-mono">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-accent">
            {month}
          </span>
          <span className="text-xl font-medium leading-tight text-ink">{day}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="microlabel">{event.category}</p>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-ink">
            {event.title}
          </h3>
          <div className="mt-2.5 flex flex-col gap-1 text-[13px] text-zinc-500">
            <span className="font-mono text-[12px]">
              {formatTime(event.startsAt, event.timezone)} ·{' '}
              {event.timezone.split('/').pop()?.replace('_', ' ')}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span className="truncate">
                {event.eventFormat === 'ONLINE'
                  ? 'Online event'
                  : `${event.venueName}, ${event.venueCity}`}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span className="font-mono text-[12px]">{event.capacity}</span> capacity
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-surface">
      <div className="skeleton aspect-[16/9]" />
      <div className="space-y-2.5 p-4">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}
