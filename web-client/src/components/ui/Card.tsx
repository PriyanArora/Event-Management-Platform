import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}) {
  return (
    <Tag className={`rounded border border-zinc-200 bg-white ${className}`}>
      {children}
    </Tag>
  );
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-zinc-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
