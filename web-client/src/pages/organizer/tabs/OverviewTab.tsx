import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { organizerApi } from '../../../lib/api';
import { useApi } from '../../../hooks/useApi';
import { useEventContext } from '../EventManageLayout';
import { eventFormatLabel, formatDateTime } from '../../../lib/format';
import { Card } from '../../../components/ui/Card';
import { Stat } from '../../../components/ui/Stat';
import { EventBanner } from '../../../components/events/EventBanner';

export function OverviewTab() {
  const { event } = useEventContext();
  const { data: analytics } = useApi((s) => organizerApi.analytics(event.id, s), [event.id]);
  const { data: types } = useApi((s) => organizerApi.types(event.id, s), [event.id]);
  const { data: questions } = useApi((s) => organizerApi.questions(event.id, s), [event.id]);
  const { data: speakers } = useApi((s) => organizerApi.speakers(event.id, s), [event.id]);
  const { data: sessions } = useApi((s) => organizerApi.sessions(event.id, s), [event.id]);
  const { data: surveys } = useApi((s) => organizerApi.surveys(event.id, s), [event.id]);

  const checklist = [
    { label: 'Registration types', count: types?.length ?? 0, to: 'registration' },
    { label: 'Registration questions', count: questions?.length ?? 0, to: 'registration' },
    { label: 'Speakers', count: speakers?.length ?? 0, to: 'agenda' },
    { label: 'Agenda sessions', count: sessions?.length ?? 0, to: 'agenda' },
    { label: 'Surveys', count: surveys?.length ?? 0, to: 'surveys' },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Confirmed" value={analytics?.confirmedRegistrations ?? '-'} />
          <Stat label="Seats left" value={analytics?.availableSeats ?? '-'} />
          <Stat label="Checked in" value={analytics?.checkIns ?? '-'} />
          <Stat label="No-shows" value={analytics?.noShows ?? '-'} />
        </div>

        <Card className="p-6">
          <h2 className="text-base font-semibold text-ink">Setup checklist</h2>
          <p className="mt-1 text-[13px] text-zinc-500">Build out your event before publishing.</p>
          <ul className="mt-4 divide-y divide-zinc-200">
            {checklist.map((c, i) => (
              <li key={c.label}>
                <Link to={c.to} className="group flex items-center justify-between py-3">
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-zinc-400 group-hover:text-accent">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-zinc-800 group-hover:text-ink">{c.label}</span>
                  </span>
                  <span className="flex items-center gap-2 text-[13px] text-zinc-400">
                    <span
                      className={`rounded border px-1.5 py-0.5 font-mono text-[11px] font-medium ${
                        c.count > 0
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                          : 'border-zinc-300 bg-zinc-100 text-zinc-400'
                      }`}
                    >
                      {c.count}
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="h-32 border-b border-zinc-200">
            <EventBanner event={event} rounded="rounded-none" />
          </div>
          <div className="space-y-3 p-5 text-[13px]">
            <Row label="Format">{eventFormatLabel[event.eventFormat]}</Row>
            <Row label="Category">{event.category}</Row>
            <Row label="Capacity">{event.capacity}</Row>
            <Row label="Venue">
              {event.eventFormat === 'ONLINE' ? 'Online' : `${event.venueName}, ${event.venueCity}`}
            </Row>
            <Row label="Created">{formatDateTime(event.createdAt)}</Row>
            <Row label="Updated">{formatDateTime(event.updatedAt)}</Row>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="microlabel">{label}</span>
      <span className="text-right font-medium text-zinc-800">{children}</span>
    </div>
  );
}
