import { Badge } from '@/components/ui/badge'
import { StarburstIcon } from '@/components/starburst-icon'

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur-xl" role="banner">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-8 xl:px-12 2xl:px-16">
        <a
          className="flex cursor-pointer items-center gap-3 text-sm font-medium text-foreground transition-opacity hover:opacity-80"
          href="/"
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
            <StarburstIcon />
          </span>
          <span className="font-display text-2xl font-semibold tracking-[-0.03em]">
            Let me Claude it
          </span>
        </a>
        <Badge
          variant="secondary"
          className="hidden rounded-full border border-border/60 bg-white/65 px-3 py-1 text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase md:inline-flex"
        >
          Unofficial fan tool
        </Badge>
      </div>
    </header>
  )
}
