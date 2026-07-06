import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

const control =
  'w-full rounded-lg border border-zinc-300 bg-surface px-3 py-2 text-sm text-ink placeholder:text-zinc-400 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 disabled:bg-zinc-50 disabled:text-zinc-400';

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-[13px] font-medium text-zinc-700">
          {label}
          {required && <span className="ml-0.5 text-accent" aria-hidden>*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-zinc-400">{hint}</p>}
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...props }, ref) {
    return <input ref={ref} className={`${control} ${className}`} {...props} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = '', rows = 4, ...props }, ref) {
    return <textarea ref={ref} rows={rows} className={`${control} resize-y ${className}`} {...props} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = '', children, ...props }, ref) {
    return (
      <select ref={ref} className={`${control} cursor-pointer pr-9 ${className}`} {...props}>
        {children}
      </select>
    );
  },
);

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${
          checked ? 'bg-accent' : 'bg-zinc-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface transition-transform duration-200 ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </span>
      {label && <span className="text-[13px] text-zinc-700">{label}</span>}
    </button>
  );
}
