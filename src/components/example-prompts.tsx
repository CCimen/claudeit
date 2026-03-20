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
    <div className="mx-auto mt-8 flex w-full max-w-5xl flex-col items-center gap-3">
      <span className="editorial-label text-[0.68rem] text-muted-foreground">
        Prompt starters
      </span>
      <div className="soft-card flex w-full flex-col items-stretch gap-2 rounded-2xl sm:rounded-[1.8rem] border border-border/60 bg-white/40 p-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3 sm:p-4">
        {examplePrompts.map((prompt, index) => (
          <Button
            key={prompt}
            variant="outline"
            className="animate-fade-up h-auto cursor-pointer whitespace-normal rounded-xl sm:rounded-[1.5rem] border-border/70 bg-white/50 px-4 py-3 text-left text-sm text-muted-foreground shadow-[0_8px_24px_rgba(62,43,31,0.04)] transition-[transform,background-color,color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-white/80 hover:text-foreground hover:shadow-[0_8px_24px_rgba(62,43,31,0.08)]"
            onClick={() => onSelect(prompt)}
            style={{ animationDelay: `${index * 70}ms` }}
            type="button"
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  )
}
