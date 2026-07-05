// Tiny classnames joiner — stands in for shadcn's `cn` (clsx + tailwind-merge)
// since this project is plain Vite + React without Tailwind.
export function cn(...args) {
  return args.filter(Boolean).join(" ");
}
