const colors = ['#c66442', '#d4956b', '#7a9585', '#b8a08a', '#e8c4a0']

type Particle = {
  color: string
  opacity: number
  rotation: number
  size: number
  vr: number
  vx: number
  vy: number
  x: number
  y: number
}

export function burstConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return
  }

  const particles: Particle[] = []

  for (let i = 0; i < 55; i++) {
    const angle = Math.random() * Math.PI * 2
    const velocity = 3 + Math.random() * 7
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.38,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 3,
      size: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
      opacity: 1,
    })
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let alive = false

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.22
      p.vx *= 0.99
      p.rotation += p.vr
      p.opacity -= 0.013

      if (p.opacity <= 0) continue
      alive = true

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      ctx.restore()
    }

    if (alive) {
      requestAnimationFrame(animate)
    } else {
      canvas.remove()
    }
  }

  requestAnimationFrame(animate)
}
