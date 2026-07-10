/**
 * Zero-latency Thai pronunciation via Web Speech API.
 * No network audio fetches — speechSynthesis only, with local Web Audio fallback.
 */

let audioCtx = null
let thaiVoice = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function pickThaiVoice() {
  if (!window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  thaiVoice =
    voices.find((v) => v.lang === 'th-TH') ||
    voices.find((v) => v.lang?.toLowerCase().startsWith('th')) ||
    null
  return thaiVoice
}

export function initSpeech() {
  if (!window.speechSynthesis) return
  pickThaiVoice()
  window.speechSynthesis.addEventListener('voiceschanged', pickThaiVoice)
}

function isSpeakableThai(char) {
  if (!char || char === ' ') return false
  const code = char.codePointAt(0)
  return code >= 0x0e01 && code <= 0x0e5b
}

/**
 * Speak a Thai character instantly via speechSynthesis (th-TH).
 */
export function speakThaiChar(char) {
  if (!isSpeakableThai(char)) {
    playCorrectTone(char)
    return
  }

  if (!window.speechSynthesis) {
    playCorrectTone(char)
    return
  }

  try {
    // Drop any queued utterance so rapid typing stays snappy
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(char)
    utterance.lang = 'th-TH'
    utterance.rate = 1.2 // Slightly faster for responsive typing feel

    if (!thaiVoice) pickThaiVoice()
    if (thaiVoice) utterance.voice = thaiVoice

    window.speechSynthesis.speak(utterance)
  } catch {
    playCorrectTone(char)
  }
}

function charPitch(char) {
  const code = char.codePointAt(0) || 0
  return 220 + ((code * 17) % 320)
}

export function playCorrectTone(char) {
  try {
    const ctx = getCtx()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const freq = charPitch(char)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.08)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.2)
  } catch {
    /* audio unavailable */
  }
}

export function playErrorTone() {
  try {
    const ctx = getCtx()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(160, now)
    osc.frequency.linearRampToValueAtTime(110, now + 0.12)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.16)
  } catch {
    /* audio unavailable */
  }
}

export function unlockAudio() {
  getCtx()
  if (!window.speechSynthesis) return
  try {
    // Warm the speech engine on a user gesture (autoplay policies)
    window.speechSynthesis.cancel()
    const warm = new SpeechSynthesisUtterance('')
    warm.volume = 0
    warm.lang = 'th-TH'
    window.speechSynthesis.speak(warm)
    window.speechSynthesis.cancel()
    pickThaiVoice()
  } catch {
    /* ignore */
  }
}
