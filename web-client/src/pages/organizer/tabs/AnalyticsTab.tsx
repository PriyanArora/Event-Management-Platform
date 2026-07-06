import { organizerApi } from '../../../lib/api';
import { useApi } from '../../../hooks/useApi';
import { useEventContext } from '../EventManageLayout';
import { SectionHeading, Card } from '../../../components/ui/Card';
import { Stat } from '../../../components/ui/Stat';
import { LoadingBlock, ErrorState, EmptyState } from '../../../components/ui/States';

export function AnalyticsTab() {
  const { event } = useEventContext();
  const { data, loading, error, reload } = useApi((s) => organizerApi.analytics(event.id, s), [event.id]);

  if (loading) return <LoadingBlock />;
  if (error || !data) return <ErrorState message={error ?? 'Could not load analytics.'} onRetry={reload} />;

  const fillPct = data.capacity > 0 ? Math.min(100, Math.round((data.confirmedRegistrations / data.capacity) * 100)) : 0;
  const checkInPct = data.confirmedRegistrations > 0 ? Math.round((data.checkIns / data.confirmedRegistrations) * 100) : 0;
  const maxType = Math.max(1, ...data.registrationTypeBreakdown.map((t) => t.confirmedCount));

  return (
    <div className="space-y-6">
      <SectionHeading title="Analytics" description="Live registration and attendance metrics for this event." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Stat label="Capacity" value={data.capacity} />
        <Stat label="Confirmed" value={data.confirmedRegistrations} />
        <Stat label="Available seats" value={data.availableSeats} />
        <Stat label="Checked in" value={data.checkIns} />
        <Stat label="No-shows" value={data.noShows} />
        <Stat label="Cancelled" value={data.cancelledRegistrations} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <p className="microlabel">Capacity utilization</p>
          <p className="mt-1 text-[13px] text-zinc-500">
            {data.confirmedRegistrations} of {data.capacity} seats confirmed
          </p>
          <div className="mt-5">
            <div className="flex items-end justify-between">
              <span className="font-mono text-4xl font-medium tracking-tight text-ink">{fillPct}%</span>
              <span className="font-mono text-[12px] text-zinc-400">{data.availableSeats} seats left</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded bg-zinc-100">
              <div className="h-full bg-accent transition-all" style={{ width: `${fillPct}%` }} />
            </div>
          </div>

          <p className="microlabel mt-8">Check-in rate</p>
          <p className="mt-1 text-[13px] text-zinc-500">
            {data.checkIns} of {data.confirmedRegistrations} confirmed attendees
          </p>
          <div className="mt-5">
            <div className="flex items-end justify-between">
              <span className="font-mono text-4xl font-medium tracking-tight text-ink">{checkInPct}%</span>
              <span className="font-mono text-[12px] text-zinc-400">{data.noShows} no-shows</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded bg-zinc-100">
              <div className="h-full bg-emerald-600 transition-all" style={{ width: `${checkInPct}%` }} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="microlabel">Registration types</p>
          <p className="mt-1 text-[13px] text-zinc-500">Confirmed registrations by type</p>
          {data.registrationTypeBreakdown.length === 0 ? (
            <EmptyState title="No type breakdown" description="This event doesn't use registration types, or has no confirmed registrations yet." />
          ) : (
            <ul className="mt-5 space-y-4">
              {data.registrationTypeBreakdown.map((t) => (
                <li key={t.registrationTypeName}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="font-medium text-zinc-800">{t.registrationTypeName}</span>
                    <span className="font-mono text-zinc-500">{t.confirmedCount}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-zinc-100">
                    <div
                      className="h-full bg-ink transition-all"
                      style={{ width: `${Math.round((t.confirmedCount / maxType) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
