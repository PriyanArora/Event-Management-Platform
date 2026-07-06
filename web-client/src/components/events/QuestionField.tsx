import { Star } from 'lucide-react';
import type { QuestionType } from '../../lib/types';
import { Field, Input, Textarea } from '../ui/Field';

/**
 * Renders an input for a registration/survey question and reports its value
 * as a string. YES_NO emits "YES"/"NO"; RATING_1_TO_5 emits "1".."5".
 */
export function QuestionField({
  id,
  label,
  type,
  required,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <Field label={label} htmlFor={id} required={required} error={error}>
      {type === 'TEXT' && (
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {type === 'LONG_TEXT' && (
        <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {type === 'YES_NO' && (
        <div className="flex gap-2">
          {['YES', 'NO'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={value === opt}
              className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                value === opt
                  ? 'border-accent bg-accent-soft text-accent-ink'
                  : 'border-zinc-300 bg-surface text-zinc-600 hover:border-ink hover:text-ink'
              }`}
            >
              {opt === 'YES' ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      )}
      {type === 'RATING_1_TO_5' && (
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = Number(value) >= n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange(String(n))}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                aria-pressed={Number(value) === n}
                className="rounded-lg p-1 transition-colors hover:bg-zinc-100"
              >
                <Star
                  className={`h-6 w-6 ${active ? 'fill-accent text-accent' : 'fill-transparent text-zinc-300'}`}
                />
              </button>
            );
          })}
          {value && <span className="ml-1.5 font-mono text-sm text-zinc-500">{value}/5</span>}
        </div>
      )}
    </Field>
  );
}
