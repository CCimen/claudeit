import { cn } from '@/lib/utils'

type StarburstIconProps = {
  className?: string
}

export function StarburstIcon({ className }: StarburstIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-5', className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 1.75 13.42 8l5.6-3.12-3.9 5.06 6.42 1.15-6.42 1.16 3.9 5.05L13.42 14 12 20.25 10.58 14l-5.6 3.11 3.9-5.05L2.46 11.1l6.42-1.15-3.9-5.06L10.58 8 12 1.75Z"
        fill="currentColor"
      />
      <circle cx="12" cy="11" r="1.35" fill="var(--background)" />
    </svg>
  )
}
