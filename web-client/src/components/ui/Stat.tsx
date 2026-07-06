import type { ReactNode } from 'react';

/**
 * Precision-grid stat: mono microlabel on top, oversized numeral below.
 * Numbers are the hero — no decorative icon chips.
 */
export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-surface p-5">
      <p className="microlabel">{label}</p>
      <p className="mt-3 font-mono text-3xl font-medium tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-[12px] text-zinc-400">{hint}</p>}
    </div>
  );
}
