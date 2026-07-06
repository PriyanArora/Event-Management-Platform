// shadcn's canonical cn: clsx for conditionals + tailwind-merge so later
// Tailwind classes actually override earlier conflicting ones.
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
