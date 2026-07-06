import { useEffect, useState } from 'react';
import { Copy, Check, Loader2, Ticket as TicketIcon } from 'lucide-react';
import { registrationsApi, ApiError } from '../../lib/api';
import type { Registration, Ticket } from '../../lib/types';
import { formatDateTime } from '../../lib/format';
import { Modal } from '../ui/Modal';

/** Issues and displays a fresh ticket code for a confirmed registration. */
export function TicketModal({
  registration,
  open,
  onClose,
}: {
  registration: Registration | null;
  open: boolean;
  onClose: () => void;
}) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !registration) return;
    setTicket(null);
    setError(null);
    let cancelled = false;
    registrationsApi
      .ticket(registration.registrationId)
      .then((t) => !cancelled && setTicket(t))
      .catch((err) =>
        !cancelled && setError(err instanceof ApiError ? err.message : 'Could not issue ticket.'),
      );
    return () => {
      cancelled = true;
    };
  }, [open, registration]);

  const copy = () => {
    if (!ticket) return;
    navigator.clipboard?.writeText(ticket.ticketCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Modal open={open} onClose={onClose} title="Your ticket" description={registration?.eventTitle}>
      {!ticket && !error && (
        <div className="flex items-center justify-center gap-2 py-12 font-mono text-[13px] text-zinc-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Issuing ticket…
        </div>
      )}
      {error && <p className="py-8 text-center text-sm text-red-700">{error}</p>}
      {ticket && (
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <div className="flex items-center gap-3 bg-ink px-5 py-4 text-paper">
            <TicketIcon className="h-5 w-5 text-accent" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{registration?.eventTitle}</p>
              <p className="text-[12px] text-zinc-400">
                {registration?.attendeeDisplayNameSnapshot}
              </p>
            </div>
          </div>
          {/* Perforation between stub header and body. */}
          <div className="border-t border-dashed border-zinc-300" aria-hidden />
          <div className="bg-surface px-5 py-6">
            <p className="microlabel text-center">Ticket code</p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <code className="select-all rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 font-mono text-2xl font-medium tracking-[0.2em] text-ink">
                {ticket.ticketCode}
              </code>
              <button
                onClick={copy}
                className="rounded-lg border border-zinc-300 p-2.5 text-zinc-500 transition-colors hover:border-ink hover:text-ink"
                aria-label="Copy ticket code"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-700" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <FakeBarcode seed={ticket.ticketCode} />
            <p className="mt-4 text-center font-mono text-[11px] text-zinc-400">
              Issued {formatDateTime(ticket.issuedAt)} · Present this code at check-in
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}

/** Deterministic decorative barcode derived from the ticket code. */
function FakeBarcode({ seed }: { seed: string }) {
  const bars: number[] = [];
  for (let i = 0; i < 48; i++) {
    const c = seed.charCodeAt(i % seed.length);
    bars.push(((c >> i % 5) & 3) + 1);
  }
  return (
    <div className="mt-5 flex h-12 items-end justify-center gap-[2px]" aria-hidden>
      {bars.map((w, i) => (
        <span key={i} className="bg-ink" style={{ width: w, height: `${60 + ((w * 13) % 40)}%` }} />
      ))}
    </div>
  );
}
