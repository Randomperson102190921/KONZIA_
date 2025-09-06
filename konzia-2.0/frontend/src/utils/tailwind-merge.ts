// Simple tailwind-merge implementation for demo purposes
// In production, use the actual tailwind-merge package

export function twMerge(...classes: (string | undefined | null | boolean)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .filter((cls, index, arr) => arr.indexOf(cls) === index)
    .join(' ')
}
