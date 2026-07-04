import type {
  CheckInStatus,
  EventFormat,
  EventStatus,
  QuestionType,
  RegistrationStatus,
  SurveyStatus,
} from './types';

/** Format an ISO instant in a given IANA timezone (falls back to local). */
export function formatDateTime(iso: string, timezone?: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone || undefined,
    timeZoneName: timezone ? 'short' : undefined,
  }).format(d);
}

export function formatDate(iso: string, timezone?: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone || undefined,
  }).format(d);
}

export function formatTime(iso: string, timezone?: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone || undefined,
  }).format(d);
}

/** Compact day badge, e.g. { month: 'JUN', day: '20' }. */
export function dateParts(iso: string, timezone?: string): { month: string; day: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { month: '', day: '' };
  const month = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    timeZone: timezone || undefined,
  })
    .format(d)
    .toUpperCase();
  const day = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    timeZone: timezone || undefined,
  }).format(d);
  return { month, day };
}

export function isPast(iso: string): boolean {
  const d = new Date(iso);
  return !Number.isNaN(d.getTime()) && d.getTime() < Date.now();
}

/** Convert an ISO instant to the value a datetime-local input expects (local time). */
export function toLocalInputValue(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** Convert a datetime-local input value back to an ISO instant. */
export function fromLocalInputValue(value: string): string {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

// ----- Labels & badge styling -----

export const eventFormatLabel: Record<EventFormat, string> = {
  IN_PERSON: 'In person',
  ONLINE: 'Online',
  HYBRID: 'Hybrid',
};

export const questionTypeLabel: Record<QuestionType, string> = {
  TEXT: 'Short text',
  LONG_TEXT: 'Long text',
  YES_NO: 'Yes / No',
  RATING_1_TO_5: 'Rating (1–5)',
};

type BadgeMeta = { label: string; className: string };

export const eventStatusMeta: Record<EventStatus, BadgeMeta> = {
  DRAFT: { label: 'Draft', className: 'border-amber-300 bg-amber-50 text-amber-800' },
  PUBLISHED: { label: 'Published', className: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
  CANCELLED: { label: 'Cancelled', className: 'border-red-300 bg-red-50 text-red-800' },
};

export const surveyStatusMeta: Record<SurveyStatus, BadgeMeta> = {
  DRAFT: { label: 'Draft', className: 'border-amber-300 bg-amber-50 text-amber-800' },
  ACTIVE: { label: 'Active', className: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
  CLOSED: { label: 'Closed', className: 'border-zinc-300 bg-zinc-100 text-zinc-600' },
};

export const registrationStatusMeta: Record<RegistrationStatus, BadgeMeta> = {
  CONFIRMED: { label: 'Confirmed', className: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
  CANCELLED: { label: 'Cancelled', className: 'border-red-300 bg-red-50 text-red-800' },
};

export const checkInMeta: Record<CheckInStatus, BadgeMeta> = {
  NOT_CHECKED_IN: { label: 'Not checked in', className: 'border-zinc-300 bg-zinc-100 text-zinc-600' },
  CHECKED_IN: { label: 'Checked in', className: 'border-accent/40 bg-accent-soft text-accent-ink' },
};

/** Stable flat placeholder tint for banner-less events (hashed from id). */
export function accentFor(seed: string): string {
  const palette = [
    'bg-zinc-200 text-zinc-500',
    'bg-accent-soft text-accent-ink',
    'bg-zinc-100 text-zinc-500',
    'bg-ink text-zinc-400',
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

/** A unique idempotency key for registration submissions. */
export function idempotencyKey(): string {
  return `reg-${crypto.randomUUID()}`;
}
