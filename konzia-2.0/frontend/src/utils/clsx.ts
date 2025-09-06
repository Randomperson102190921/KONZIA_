export function clsx(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
}
