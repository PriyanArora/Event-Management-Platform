import { accentFor } from '../../lib/format';

/* Fine grid texture for banner-less events — flat tint, no gradients. */
const gridTexture: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

/** Event banner image with a deterministic flat-tint fallback. */
export function EventBanner({
  event,
  className = '',
  rounded = 'rounded-lg',
}: {
  event: { id: string; title: string; bannerImageUrl?: string | null; category?: string };
  className?: string;
  rounded?: string;
}) {
  if (event.bannerImageUrl) {
    return (
      <img
        src={event.bannerImageUrl}
        alt={event.title}
        loading="lazy"
        className={`h-full w-full object-cover ${rounded} ${className}`}
      />
    );
  }
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${accentFor(
        event.id,
      )} ${rounded} ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.12]" style={gridTexture} aria-hidden />
      <span className="relative px-6 text-center text-lg font-semibold tracking-tight">
        {event.title}
      </span>
    </div>
  );
}
