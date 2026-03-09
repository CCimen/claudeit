import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const steps = [
  'Type the question they should have asked.',
  'Copy the link and drop it in chat.',
  'They land here, then head to Claude.',
]

export function HowItWorks() {
  return (
    <section aria-label="How it works" className="mx-auto mt-12 w-full max-w-5xl xl:mt-16">
      <Card className="soft-card grain rounded-[2rem] border border-border/70 bg-card/85">
        <CardHeader className="gap-2 text-left">
          <CardTitle className="font-display text-2xl font-semibold tracking-[-0.02em]">
            How it works
          </CardTitle>
          <CardDescription>
            One page. One link. One gentle nudge toward self-service.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-3 sm:gap-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-[1.4rem] border border-border/60 bg-white/55 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-shadow duration-300 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_16px_rgba(62,43,31,0.06)]"
            >
              <div className="mb-3 flex size-8 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-foreground">{step}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
