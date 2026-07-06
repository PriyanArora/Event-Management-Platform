import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  // Dark-canvas hierarchy: primary is the bright button.
  primary:
    'bg-ink text-paper hover:bg-white hover:shadow-[0_0_24px_rgba(255,255,255,0.12)] active:bg-zinc-800',
  accent: 'bg-accent text-white hover:bg-accent-hover hover:shadow-glow active:bg-accent',
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
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
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
  return (
    <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
}
