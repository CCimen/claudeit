import { useEffect, useRef } from 'react'

type Blob = {
  baseX: number
  baseY: number
  color: [number, number, number]
  drift: number
  mouseInfluence: number
  opacity: number
  phase: number
  radius: number
  x: number
  y: number
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    document.documentElement.classList.add('aurora-active')

    let mouseX = 0.5
    let mouseY = 0.3
    let animationId: number

    const blobs: Blob[] = [
      {
        // Primary: warm terracotta, tracks cursor strongly
        x: 0.5,
        y: 0.2,
        baseX: 0.5,
        baseY: 0.18,
        radius: 0.52,
        color: [198, 100, 66],
        opacity: 0.28,
        drift: 0.00028,
        phase: 0,
        mouseInfluence: 0.6,
      },
      {
        // Secondary: softer peach, follows at half strength
        x: 0.62,
        y: 0.32,
        baseX: 0.62,
        baseY: 0.3,
        radius: 0.4,
        color: [212, 149, 107],
        opacity: 0.18,
        drift: 0.00022,
        phase: 2.1,
        mouseInfluence: 0.3,
      },
      {
        // Tertiary: sage green, drifts on its own
        x: 0.28,
        y: 0.72,
        baseX: 0.25,
        baseY: 0.75,
        radius: 0.44,
        color: [122, 149, 133],
        opacity: 0.2,
        drift: 0.00018,
        phase: 4.2,
        mouseInfluence: 0.15,
      },
    ]

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio, 2) * 0.4
      canvas.width = Math.round(window.innerWidth * scale)
      canvas.height = Math.round(window.innerHeight * scale)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth
      mouseY = e.clientY / window.innerHeight
    }

    const draw = (time: number) => {
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      for (const blob of blobs) {
        const driftX = Math.sin(time * blob.drift + blob.phase) * 0.1
        const driftY =
          Math.cos(time * blob.drift * 0.7 + blob.phase + 1) * 0.08

        const targetX =
          blob.baseX + driftX + (mouseX - 0.5) * blob.mouseInfluence
        const targetY =
          blob.baseY + driftY + (mouseY - 0.5) * blob.mouseInfluence * 0.6

        // Faster lerp so cursor tracking is clearly visible
        blob.x = lerp(blob.x, targetX, 0.03)
        blob.y = lerp(blob.y, targetY, 0.03)

        const cx = blob.x * w
        const cy = blob.y * h
        const r = blob.radius * Math.max(w, h)

        const [cr, cg, cb] = blob.color
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        gradient.addColorStop(0, `rgba(${cr},${cg},${cb},${blob.opacity})`)
        gradient.addColorStop(
          0.4,
          `rgba(${cr},${cg},${cb},${blob.opacity * 0.4})`,
        )
        gradient.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, w, h)
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.documentElement.classList.remove('aurora-active')
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  )
}
