import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

// 8 kite-shaped rays decomposed from the original starburst path.
// Each ray: center(12,11) → inner-left → tip → inner-right → center
const rays = [
  'M12 11 L10.58 8 L12 1.75 L13.42 8Z',
  'M12 11 L13.42 8 L19.02 4.88 L15.12 9.94Z',
  'M12 11 L15.12 9.94 L21.54 11.09 L15.12 12.25Z',
  'M12 11 L15.12 12.25 L19.02 17.3 L13.42 14Z',
  'M12 11 L13.42 14 L12 20.25 L10.58 14Z',
  'M12 11 L10.58 14 L4.98 17.11 L8.88 12.06Z',
  'M12 11 L8.88 12.06 L2.46 11.1 L8.88 9.95Z',
  'M12 11 L8.88 9.95 L4.98 4.89 L10.58 8Z',
]

const particles = [
  { angle: 30, delay: 0, duration: 4.5 },
  { angle: 110, delay: 1.4, duration: 3.8 },
  { angle: 200, delay: 3.1, duration: 4.2 },
  { angle: 285, delay: 0.7, duration: 3.5 },
  { angle: 350, delay: 2.2, duration: 4.0 },
]

type HeroStarburstProps = {
  className?: string
  flare?: boolean
  promptLength?: number
}

export function HeroStarburst({
  className,
  flare = false,
  promptLength = 0,
}: HeroStarburstProps) {
  const shouldReduceMotion = useReducedMotion()

  // Prompt length gently scales the starburst (1.0 → 1.12)
  const promptScale = 1 + Math.min(promptLength / 1500, 1) * 0.12

  return (
    <div className="relative flex items-center justify-center">
      {/* Warm particles drifting off the tips */}
      {!shouldReduceMotion &&
        particles.map((p, i) => (
          <span
            key={i}
            className="particle-drift absolute left-1/2 top-1/2 size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40"
            style={{
              rotate: `${p.angle}deg`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

      {/* Starburst SVG — rotation via CSS, scale via motion spring */}
      <motion.svg
        animate={{
          scale: flare ? 1.5 : promptScale,
        }}
        aria-hidden="true"
        className={cn(shouldReduceMotion ? '' : 'starburst-rotate', className)}
        fill="none"
        transition={
          flare
            ? { type: 'spring', stiffness: 400, damping: 10 }
            : { type: 'spring', stiffness: 50, damping: 14 }
        }
        viewBox="0 0 24 24"
      >
        {rays.map((d, i) => (
          <path
            key={i}
            className={shouldReduceMotion ? '' : 'ray-breathe'}
            d={d}
            fill="currentColor"
            style={
              shouldReduceMotion
                ? undefined
                : { animationDelay: `${i * 0.38}s` }
            }
          />
        ))}
        <circle cx="12" cy="11" r="1.35" fill="var(--background)" />
      </motion.svg>

      {/* Glow burst on flare */}
      <motion.div
        animate={{
          opacity: flare ? 0.45 : 0,
          scale: flare ? 2.8 : 1,
        }}
        className="pointer-events-none absolute inset-0 rounded-full bg-primary/30 blur-xl"
        transition={{ duration: flare ? 0.15 : 0.7 }}
      />
    </div>
  )
}
