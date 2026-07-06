import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { NoiseBackground } from './NoiseBackground';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

// Wordmark type on every button: lowercase, tight tracking, display face.
const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold lowercase tracking-[-0.02em] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap';

// primary/accent render inside a NoiseBackground ring (Aceternity), so their
// own surface is the dark pill from the noise-background demo.
const noisePill =
  'w-full border border-white/40 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B] to-[#1A1A1E] text-ink shadow-[0px_1px_0px_0px_rgba(0,0,0,0.9)_inset,0px_1px_0px_0px_rgba(255,255,255,0.08)] hover:border-white/60 active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary: noisePill,
  accent: noisePill,
  outline:
    'border border-zinc-300 bg-white/[0.03] text-ink hover:border-zinc-400 hover:bg-white/[0.06] active:bg-white/[0.08]',
  ghost: 'text-zinc-600 hover:bg-white/[0.06] hover:text-ink active:bg-white/[0.08]',
  danger:
    'border border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 active:bg-red-100',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

const hasNoise = (v: Variant) => v === 'primary' || v === 'accent';

// The animated gradient ring around primary/accent buttons. Layout classes
// from the caller land on this wrapper so w-full/w-fit keep working.
function NoiseRing({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <NoiseBackground containerClassName={cn('rounded-full p-[3px]', className)}>
      {children}
    </NoiseBackground>
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<
  HTMLButtonElement,
  CommonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(function Button(
  { variant = 'primary', size = 'md', loading, leftIcon, rightIcon, className = '', children, disabled, ...props },
  ref,
) {
  const noise = hasNoise(variant);
  const button = (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], !noise && className)}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
  return noise ? <NoiseRing className={className}>{button}</NoiseRing> : button;
});

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}: CommonProps & LinkProps) {
  const noise = hasNoise(variant);
  const link = (
    <Link className={cn(base, variants[variant], sizes[size], !noise && className)} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
  return noise ? <NoiseRing className={className}>{link}</NoiseRing> : link;
}
