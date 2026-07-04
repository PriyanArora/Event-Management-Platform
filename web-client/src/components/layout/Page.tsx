import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/** Centered max-width content container with standard horizontal padding. */
export function Container({
  children,
  className = '',
  size = 'lg',
}: {
  children: ReactNode;
  className?: string;
  size?: 'md' | 'lg';
}) {
  const max = size === 'md' ? 'max-w-5xl' : 'max-w-7xl';
  return <div className={`mx-auto w-full ${max} px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
}) {
  return (
    <div className="mb-8">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {eyebrow && <p className="microlabel mb-2">{eyebrow}</p>}
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm text-zinc-500">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="mb-3 flex items-center gap-1 font-mono text-[12px] text-zinc-400">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-zinc-600">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
