/**
 * Lightweight canvas confetti burst for the completion modal.
 */
const COLORS = ['#2dd4a8', '#5eead4', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#e8f0eb']

export function burstConfetti(canvas, { duration = 2200, particleCount = 90 } = {}) {
  if (!canvas) return () => {}

  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let w = 0
  let h = 0
  let raf = 0
  let running = true
  const start = performance.now()

  function resize() {
    const parent = canvas.parentElement
    w = parent?.clientWidth || window.innerWidth
    h = parent?.clientHeight || window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  resize()

  const cx = w / 2
  const cy = h * 0.38

  const particles = Array.from({ length: particleCount }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15
    const speed = 4 + Math.random() * 9
    return {
      x: cx + (Math.random() - 0.5) * 40,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 3,
      g: 0.12 + Math.random() * 0.08,
      size: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      shape: Math.random() > 0.45 ? 'rect' : 'circle',
      alpha: 1,
    }
  })

  function frame(now) {
    if (!running) return
    const t = now - start
    ctx.clearRect(0, 0, w, h)

    for (const p of particles) {
      p.vy += p.g
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.992
      p.rot += p.vr
      p.alpha = Math.max(0, 1 - t / duration)

      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      } else {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    ctx.globalAlpha = 1

    if (t < duration) {
      raf = requestAnimationFrame(frame)
    } else {
      ctx.clearRect(0, 0, w, h)
      running = false
    }
  }

  raf = requestAnimationFrame(frame)

  return function stop() {
    running = false
    cancelAnimationFrame(raf)
    ctx.clearRect(0, 0, w, h)
  }
}
