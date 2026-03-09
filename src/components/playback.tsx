import { useEffect, useState } from 'react'
import { CopyIcon, ExternalLinkIcon, RotateCcwIcon } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { StarburstIcon } from '@/components/starburst-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { buildClaudeUrl } from '@/lib/claude'
import { shouldShowRefusal } from '@/lib/experience'

const statusLines = [
  'This is still faster than another team thread.',
  'Let Claude do the heavy lifting for once.',
  'A friend wanted you to take the hint.',
]

const refusalMessage =
  'I appreciate your question, but I need to respectfully decline... actually, never mind.'

type PlaybackProps = {
  onCopyPrompt: () => Promise<void>
  onCreateYourOwn: () => void
  onOpenClaude: () => void
  prompt: string
}

function getCharacterDelay(character: string) {
  if (['.', '!', '?', ',', ';', ':'].includes(character)) {
    return 65
  }

  if (character === ' ') {
    return 20
  }

  return 32
}

export function Playback({
  onCopyPrompt,
  onCreateYourOwn,
  onOpenClaude,
  prompt,
}: PlaybackProps) {
  const shouldReduceMotion = useReducedMotion()
  const [displayText, setDisplayText] = useState('')
  const [statusIndex, setStatusIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'opening'>('typing')
  const [showRefusal] = useState(() => shouldShowRefusal())

  useEffect(() => {
    if (shouldReduceMotion) {
      return
    }

    const statusTimer = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % statusLines.length)
    }, 800)

    return () => window.clearInterval(statusTimer)
  }, [shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion) {
      const hydrateTimer = window.setTimeout(() => {
        setDisplayText(showRefusal ? refusalMessage : prompt)
        setPhase('opening')
      }, 0)

      const timer = window.setTimeout(() => {
        window.location.replace(buildClaudeUrl(prompt))
      }, 240)

      return () => {
        window.clearTimeout(hydrateTimer)
        window.clearTimeout(timer)
      }
    }

    let currentIndex = 0
    const target = showRefusal ? refusalMessage : prompt
    const timers: number[] = []

    const typeNextCharacter = () => {
      currentIndex += 1
      setDisplayText(target.slice(0, currentIndex))

      if (currentIndex < target.length) {
        timers.push(
          window.setTimeout(
            typeNextCharacter,
            getCharacterDelay(target[currentIndex] ?? ''),
          ),
        )
        return
      }

      timers.push(
        window.setTimeout(() => {
          if (showRefusal) {
            setDisplayText('')
          }

          setPhase('opening')
          timers.push(
            window.setTimeout(() => {
              window.location.replace(buildClaudeUrl(prompt))
            }, 1000),
          )
        }, showRefusal ? 520 : 1500),
      )
    }

    timers.push(window.setTimeout(typeNextCharacter, 220))

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [prompt, shouldReduceMotion, showRefusal])

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="soft-card grain mx-auto w-full max-w-5xl rounded-[2rem] border border-border/70 bg-card/90">
      <CardHeader className="gap-3 text-left">
        <Badge
          variant="secondary"
          className="w-fit rounded-full border border-border/60 bg-white/70 px-3 py-1 text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase"
        >
          Playback mode
        </Badge>
        <CardTitle className="font-display text-3xl font-semibold tracking-[-0.02em]">
          Someone thought Claude could answer this better
        </CardTitle>
        <CardDescription className="text-sm leading-6">
          They sent you here instead of explaining it themselves. You'll be
          redirected shortly.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <motion.div
          animate={{ scale: phase === 'opening' ? 0.99 : 1 }}
          className="rounded-[1.6rem] border border-border/70 bg-background/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
          layout
          transition={{ duration: 0.35 }}
        >
          <Textarea
            className="min-h-[220px] resize-none border-0 bg-transparent px-1 py-1 text-base leading-7 shadow-none focus-visible:ring-0 md:text-base"
            readOnly
            value={displayText}
          />
        </motion.div>
      </CardContent>
      <Separator className="mx-4 opacity-50 md:mx-6" />
      <CardFooter className="flex flex-col gap-4 bg-transparent px-4 py-4 md:px-6">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/12 text-primary">
              <StarburstIcon className={phase === 'opening' ? 'animate-spin' : ''} />
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={phase === 'opening' ? 'opening' : statusIndex}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                initial={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.22 }}
              >
                {phase === 'opening'
                  ? 'Opening Claude...'
                  : statusLines[statusIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={onOpenClaude}>
              <ExternalLinkIcon data-icon="inline-start" />
              Open in Claude
            </Button>
            <Button variant="secondary" onClick={() => void onCopyPrompt()}>
              <CopyIcon data-icon="inline-start" />
              Copy prompt
            </Button>
            <Button variant="ghost" onClick={onCreateYourOwn}>
              <RotateCcwIcon data-icon="inline-start" />
              Create your own
            </Button>
          </div>
        </div>
        <p className="text-left text-sm leading-6 text-muted-foreground">
          If nothing happens, use the manual button above.
        </p>
      </CardFooter>
      </Card>
    </motion.div>
  )
}
