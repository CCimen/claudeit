import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const examplePrompts = [
  'Explain quantum physics like I am five.',
  'Write a haiku about debugging production at 2 a.m.',
  'How do I center a div without starting a holy war?',
  'Rank the best pizza toppings and defend the list.',
]

type ExamplePromptsProps = {
  onSelect: (prompt: string) => void
}

export function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  return (
    <div className="mx-auto mt-5 flex w-full max-w-5xl flex-col items-center gap-3">
      <Badge
        variant="outline"
        className="rounded-full bg-white/60 px-3 py-1 text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase"
      >
        Prompt starters
      </Badge>
      <div className="soft-card flex w-full flex-wrap justify-center gap-2 rounded-[1.8rem] border border-border/60 bg-white/40 p-3 sm:gap-3 sm:p-4">
        {examplePrompts.map((prompt) => (
          <Button
            key={prompt}
            variant="outline"
            className="h-auto cursor-pointer whitespace-normal rounded-[1.5rem] border-border/70 bg-white/50 px-4 py-3 text-left text-sm text-muted-foreground shadow-[0_8px_24px_rgba(62,43,31,0.04)] transition-[transform,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-white/80 hover:text-foreground hover:shadow-[0_8px_24px_rgba(62,43,31,0.08)]"
            onClick={() => onSelect(prompt)}
            type="button"
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  )
}
