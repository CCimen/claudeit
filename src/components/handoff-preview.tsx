import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRightIcon, GlobeIcon, SparklesIcon } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { StarburstIcon } from '@/components/starburst-icon'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const previewPrompt = 'Summarize this thread into three blunt bullet points.'

const previewSteps = [
  'Paste prompt',
  'Build share link',
  'Open in Claude',
]

type HandoffPreviewProps = {
  compact?: boolean
  isPaused?: boolean
}

export function HandoffPreview({ compact = false, isPaused = false }: HandoffPreviewProps) {
  const shouldReduceMotion = useReducedMotion()
  const [displayText, setDisplayText] = useState('')
  const [status, setStatus] = useState<'typing' | 'link' | 'handoff'>('typing')
  const [progress, setProgress] = useState(18)
  const [cycleKey, setCycleKey] = useState(0)

  const statusCopy = useMemo(() => {
    if (status === 'typing') {
      return 'Typing what they should\u2019ve typed themselves...'
    }

    if (status === 'link') {
      return 'Wrapping it in a polite link...'
    }

    return 'Sending them to someone who actually knows...'
  }, [status])

  useEffect(() => {
    if (shouldReduceMotion) {
      const timer = window.setTimeout(() => {
        setDisplayText(previewPrompt)
        setStatus('handoff')
        setProgress(88)
      }, 0)

      return () => window.clearTimeout(timer)
    }

    if (isPaused) {
      return
    }

    let currentIndex = 0
    const timers: number[] = []

    const typeNextCharacter = () => {
      currentIndex += 1
      setDisplayText(previewPrompt.slice(0, currentIndex))
      setProgress(18 + currentIndex * 0.9)

      if (currentIndex < previewPrompt.length) {
        timers.push(window.setTimeout(typeNextCharacter, 22))
        return
      }

      timers.push(
        window.setTimeout(() => {
          setStatus('link')
          setProgress(72)

          timers.push(
            window.setTimeout(() => {
              setStatus('handoff')
              setProgress(94)

              timers.push(
                window.setTimeout(() => {
                  setDisplayText('')
                  setStatus('typing')
                  setProgress(18)
                  setCycleKey((current) => current + 1)
                }, 3000),
              )
            }, 850),
          )
        }, 450),
      )
    }

    timers.push(window.setTimeout(typeNextCharacter, 300))

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [cycleKey, shouldReduceMotion, isPaused])

  const cardClassName = compact
    ? 'soft-card grain overflow-hidden rounded-t-[2rem] rounded-b-none border border-b-0 border-border/70 bg-card/92'
    : 'soft-card grain overflow-hidden rounded-[2rem] border border-border/70 bg-card/92'

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={compact ? 'w-full' : 'w-full max-w-xl'}
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className={cardClassName}>
        {!compact ? (
          <CardHeader className="gap-3 text-left">
            <Badge
              variant="secondary"
              className="w-fit rounded-full border border-border/60 bg-white/70 px-3 py-1 text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase"
            >
              Live preview
            </Badge>
            <CardTitle className="font-display text-3xl font-semibold tracking-[-0.02em]">
              What the handoff feels like
            </CardTitle>
            <CardDescription className="max-w-md leading-6">
              A small preview of the link landing, the typed prompt, and the push
              toward Claude.
            </CardDescription>
          </CardHeader>
        ) : (
          <div className="flex items-center justify-between px-4 pt-4 sm:px-5 sm:pt-5">
            <Badge
              variant="secondary"
              className="rounded-full border border-border/60 bg-white/70 px-3 py-1 text-[0.68rem] tracking-[0.16em] text-muted-foreground uppercase"
            >
              Live preview
            </Badge>
            <span className="text-xs text-muted-foreground/60">What the handoff feels like</span>
          </div>
        )}
        <CardContent className={compact ? 'flex flex-col gap-3 p-4 sm:p-5' : 'flex flex-col gap-4'}>
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            className="overflow-hidden rounded-[1.7rem] border border-border/70 bg-[#f7f1ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
            initial={{ y: 14, opacity: 0 }}
            layout
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`border-b border-border/60 bg-white/72 px-4 ${compact ? 'py-2.5' : 'py-3'}`}>
              <div className={`${compact ? 'mb-2' : 'mb-3'} flex items-center gap-2`}>
                <span className={`size-2.5 rounded-full transition-colors duration-500 ${status === 'handoff' ? 'bg-primary/55' : 'bg-primary/35'}`} />
                <span className={`size-2.5 rounded-full transition-colors duration-500 ${status === 'handoff' ? 'bg-primary/40' : 'bg-primary/22'}`} />
                <span className={`size-2.5 rounded-full transition-colors duration-500 ${status === 'handoff' ? 'bg-primary/30' : 'bg-primary/14'}`} />
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/85 px-3 py-2 text-sm text-muted-foreground">
                <GlobeIcon className="size-3.5" />
                claude.ai/new?q=
              </div>
            </div>

            <div className={compact ? 'flex min-h-[230px] flex-col gap-3 p-3 sm:p-4' : 'flex flex-col gap-4 p-4'}>
              <div className="flex items-center justify-between gap-3">
                <Badge
                  variant="outline"
                  className="rounded-full bg-white/70 px-3 py-1 text-[0.68rem] tracking-[0.16em] uppercase"
                >
                  Browser preview
                </Badge>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={status}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-muted-foreground"
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.28 }}
                  >
                    {statusCopy}
                  </motion.div>
                </AnimatePresence>
              </div>

              <Progress className="h-1.5 bg-primary/10" value={progress} />

              <motion.div
                animate={{ scale: status === 'handoff' ? 0.985 : 1 }}
                className="rounded-[1.4rem] border border-border/65 bg-white/70 p-4"
                layout
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <StarburstIcon className="size-4 text-primary" />
                    Claude handoff
                  </div>
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-primary/10 text-primary"
                  >
                    {status === 'handoff' ? 'Opening' : 'Preparing'}
                  </Badge>
                </div>
                <div
                  aria-atomic="true"
                  aria-live="polite"
                  className={`rounded-[1.1rem] border border-border/60 bg-background/80 px-4 py-3 text-left text-sm leading-6 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${compact ? 'min-h-[80px]' : 'min-h-[118px]'}`}
                >
                  {displayText || (
                    <span className="text-muted-foreground">
                      Waiting for the question...
                    </span>
                  )}
                  {status === 'typing' ? (
                    <motion.span
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      className="ml-1 inline-block h-5 w-px bg-primary align-middle"
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    />
                  ) : null}
                </div>
              </motion.div>

              <div className={`flex flex-row gap-2 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible ${compact ? '-mx-1 px-1 pb-1 sm:mx-0 sm:px-0 sm:pb-0' : ''}`}>
                {previewSteps.map((step, index) => (
                  <motion.div
                    key={step}
                    animate={{ opacity: 1, y: 0 }}
                    className={`shrink-0 snap-start rounded-[1.1rem] border border-border/60 bg-white/60 text-left text-xs text-muted-foreground sm:min-w-0 sm:shrink ${compact ? 'min-w-[140px] px-3 py-2' : 'min-w-[140px] px-3 py-2'}`}
                    initial={{ opacity: 0, y: 12 }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : 0.08 * index,
                      duration: 0.42,
                    }}
                  >
                    <div className={`tracking-[0.16em] uppercase ${compact ? 'mb-0.5 text-[0.6rem]' : 'mb-1 text-[0.65rem]'}`}>
                      Step {index + 1}
                    </div>
                    <div className={compact ? 'text-xs text-foreground' : 'text-sm text-foreground'}>{step}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {!compact && (
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="rounded-full bg-white/65 px-3 py-1 text-muted-foreground"
              >
                <SparklesIcon data-icon="inline-start" />
                Smooth landing
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full bg-white/65 px-3 py-1 text-muted-foreground"
              >
                <ArrowUpRightIcon data-icon="inline-start" />
                Claude opens prefilled
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
