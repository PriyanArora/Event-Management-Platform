/** Tiny class joiner for components ported from shadcn-style registries. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
