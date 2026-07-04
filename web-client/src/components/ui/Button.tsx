import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded font-medium transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-zinc-700 active:bg-zinc-800',
  accent: 'bg-accent text-white hover:bg-accent-hover active:bg-accent-ink',
  outline:
    'border border-zinc-300 bg-white text-ink hover:border-ink hover:bg-zinc-50 active:bg-zinc-100',
  ghost: 'text-zinc-600 hover:bg-zinc-100 hover:text-ink active:bg-zinc-200',
  danger:
    'border border-red-200 bg-white text-red-700 hover:border-red-600 hover:bg-red-50 active:bg-red-100',
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
