/**
 * Detect phones / tablets so we can show a desktop-only gate.
 * Combines UA heuristics, coarse pointer, and viewport width.
 */
export function isMobileOrTablet() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false

  const ua = navigator.userAgent || ''
  const uaMatch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

  // iPadOS 13+ may report as Mac; treat touch Macs with coarse pointer as tablets
  const iPadOsDesktopUa =
    navigator.platform === 'MacIntel' && typeof navigator.maxTouchPoints === 'number'
      ? navigator.maxTouchPoints > 1
      : false

  const narrowViewport = window.innerWidth < 1024
  const coarsePointer =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches &&
    narrowViewport

  return uaMatch || iPadOsDesktopUa || narrowViewport || coarsePointer
}
