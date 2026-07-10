/**
 * Smooth count-up animation for numeric displays.
 */
export function animateCountUp(el, target, { duration = 1500, suffix = '', decimals = 0 } = {}) {
  if (!el) return
  const start = performance.now()
  const from = 0
  const to = Number(target) || 0

  function easeOutCubic(t) {
    return 1 - (1 - t) ** 3
  }

  function frame(now) {
    const t = Math.min(1, (now - start) / duration)
    const value = from + (to - from) * easeOutCubic(t)
    const display = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value))
    el.textContent = `${display}${suffix}`
    if (t < 1) requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}
