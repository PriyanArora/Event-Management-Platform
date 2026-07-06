import type { ReactNode } from 'react';

export function Badge({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] ${className}`}
    >
      {children}
    </span>
  );
}

/** Renders a status chip from a { label, className } meta object. */
export function StatusBadge({ meta }: { meta: { label: string; className: string } }) {
  return <Badge className={meta.className}>{meta.label}</Badge>;
}
