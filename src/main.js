import './style.css'
import { KEDMANEE, KEYBOARD_ROWS, CHAR_TO_CODE } from './data/keyboard.js'
import { generateLettersText, generateWordsText } from './data/content.js'
import { speakThaiChar, playErrorTone, unlockAudio, initSpeech } from './audio.js'
import { calcWpm, calcAccuracy, topMissedKeys } from './stats.js'
import { generateCertificate } from './share.js'
import { animateCountUp } from './animate.js'
import { burstConfetti } from './confetti.js'
import {
  initAuth,
  onAuthChange,
  signInWithProvider,
  signOut,
  getUser,
  isSupabaseConfigured,
} from './auth.js'
import {
  saveScore,
  fetchPersonalStats,
  fetchPreviousPersonalBest,
  fetchPercentile,
  fetchLeaderboard,
} from './scores.js'

/** Distinct game lifecycle states */
const GameState = {
  READY: 'READY',
  TYPING: 'TYPING',
  FINISHED: 'FINISHED',
}

const DURATION_OPTIONS = [
  { label: '30s', seconds: 30 },
  { label: '1min', seconds: 60 },
  { label: '3min', seconds: 180 },
  { label: '5min', seconds: 300 },
]

const state = {
  gameState: GameState.READY,
  currentMode: 'words',
  isShiftPressed: false,
  targetText: '',
  typedText: '',
  errorMap: {},
  correctKeystrokes: 0,
  totalKeystrokes: 0,
  startedAt: null,
  keyboardVisible: true,
  audioEnabled: true,
  durationSeconds: 60,
  remainingMs: 60_000,
  timerId: 0,
  stopConfetti: null,
  finalStats: null,
  keydownAttached: false,
  /** @type {null | { id: string, email?: string, displayName: string, avatarUrl: string | null }} */
  user: null,
  personalBest: null,
  recentScore: null,
  beatPercent: null,
  isNewRecord: false,
  activeView: 'practice',
}

const el = {}

function durationLabel(seconds = state.durationSeconds) {
  const opt = DURATION_OPTIONS.find((o) => o.seconds === seconds)
  return opt?.label ?? `${seconds}s`
}

function formatTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

async function init() {
  initSpeech()
  renderShell()
  cacheEls()
  bindUiEvents()
  renderKeyboard()
  updateTimerDisplay()
  startNewRound()
  await initAuth()
  onAuthChange(async (user) => {
    state.user = user
    renderAuthUI()
    if (user) {
      await refreshPersonalStats()
    } else {
      state.personalBest = null
      state.recentScore = null
      renderPersonalWidgets()
    }
  })
}

function renderShell() {
  const durationBtns = DURATION_OPTIONS.map(
    (o) =>
      `<button type="button" class="seg-btn${o.seconds === 60 ? ' active' : ''}" data-duration="${o.seconds}">${o.label}</button>`,
  ).join('')

  document.querySelector('#app').innerHTML = `
    <header class="app-header">
      <div class="brand">
        <div class="brand-name">Thai<span>Type</span></div>
        <div class="brand-tag">Kedmanee Practice</div>
      </div>
      <div class="header-actions">
        <button type="button" class="btn btn-ghost" id="btn-audio" title="Toggle sound">Sound On</button>
        <button type="button" class="btn" id="btn-restart">Restart</button>
        <div class="auth-slot" id="auth-slot">
          <button type="button" class="btn btn-primary" id="btn-signin">Sign In</button>
        </div>
      </div>
    </header>

    <nav class="app-nav" role="tablist" aria-label="App sections">
      <button type="button" class="app-nav-tab active" data-view="practice">Practice</button>
      <button type="button" class="app-nav-tab" data-view="ranking">Global Ranking</button>
    </nav>

    <div class="profile-widgets" id="profile-widgets" hidden>
      <div class="profile-widget">
        <div class="profile-widget-label">Personal Best</div>
        <div class="profile-widget-value" id="stat-pb">—</div>
        <div class="profile-widget-sub">All-time high · ≥90% accuracy</div>
      </div>
      <div class="profile-widget">
        <div class="profile-widget-label">Recent Test</div>
        <div class="profile-widget-value" id="stat-recent">—</div>
        <div class="profile-widget-sub">Last completed session</div>
      </div>
    </div>

    <div id="view-practice" class="view-panel">
    <nav class="modes" role="tablist">
      <button type="button" class="mode-tab" data-mode="letters">Letters</button>
      <button type="button" class="mode-tab active" data-mode="words">Words</button>
      <button type="button" class="mode-tab" data-mode="custom">Custom</button>
    </nav>

    <div class="config-bar">
      <div class="seg-control" id="duration-control" role="group" aria-label="Test duration">
        ${durationBtns}
      </div>
      <div class="timer-display" id="timer-display" aria-live="polite">
        <span class="timer-value" id="timer-value">1:00</span>
        <span class="timer-label">Time</span>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat">
        <div class="stat-value accent" id="stat-wpm">0</div>
        <div class="stat-label">WPM</div>
      </div>
      <div class="stat">
        <div class="stat-value" id="stat-acc">100%</div>
        <div class="stat-label">Accuracy</div>
      </div>
      <div class="stat">
        <div class="stat-label" style="margin-bottom:0.35rem">Missed</div>
        <div class="missed-keys" id="stat-missed">
          <span class="missed-empty">—</span>
        </div>
      </div>
    </div>

    <main class="main">
      <div class="custom-panel" id="custom-panel">
        <textarea id="custom-text" placeholder="วางข้อความภาษาไทยที่นี่… Paste Thai text to practice"></textarea>
        <div class="custom-actions">
          <label class="btn btn-ghost" style="cursor:pointer">
            Upload
            <input type="file" id="custom-file" accept=".txt,text/plain" hidden />
          </label>
          <button type="button" class="btn btn-primary" id="btn-custom-start">Start Practice</button>
        </div>
      </div>

      <div class="prompt-wrap">
        <div class="prompt" id="prompt" aria-live="polite"></div>
        <div class="ime-banner" id="ime-banner" role="alert" aria-live="assertive">
          ⚠️ Please switch your system keyboard to Thai (Kedmanee Layout)
        </div>
      </div>
      <p class="hint visible" id="hint">Start typing — timer begins on first keystroke</p>
    </main>

    <section class="keyboard-section">
      <div class="keyboard-toolbar">
        <button type="button" class="btn btn-ghost" id="btn-toggle-kb">Hide Keyboard</button>
      </div>
      <div class="keyboard" id="keyboard" aria-hidden="true"></div>
    </section>
    </div>

    <div id="view-ranking" class="view-panel" hidden>
      <section class="leaderboard-section">
        <div class="leaderboard-header">
          <h2 class="leaderboard-title">Global Ranking</h2>
          <p class="leaderboard-sub">Top 50 · Personal best (≥90% accuracy)</p>
        </div>
        <div class="leaderboard-table-wrap">
          <table class="leaderboard-table" id="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>WPM</th>
                <th>Acc</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody id="leaderboard-body">
              <tr><td colspan="5" class="lb-empty">Loading…</td></tr>
            </tbody>
          </table>
        </div>
        <p class="leaderboard-note" id="leaderboard-note"></p>
      </section>
    </div>

    <div class="auth-modal-backdrop" id="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div class="auth-modal">
        <button type="button" class="auth-modal-close" id="btn-auth-close" aria-label="Close">×</button>
        <h2 class="auth-modal-title" id="auth-modal-title">Sign in to ThaiType</h2>
        <p class="auth-modal-sub">Save scores, track personal bests, and climb the global ranking. Guests can still practice freely.</p>
        <button type="button" class="oauth-btn oauth-google" id="btn-google">
          <span class="oauth-icon" aria-hidden="true">G</span>
          Continue with Google
        </button>
        <button type="button" class="oauth-btn oauth-facebook" id="btn-facebook">
          <span class="oauth-icon" aria-hidden="true">f</span>
          Continue with Facebook
        </button>
        <p class="auth-modal-hint" id="auth-config-hint" hidden>
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to enable OAuth.
        </p>
      </div>
    </div>

    <div class="modal-backdrop" id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <canvas class="confetti-canvas" id="confetti-canvas"></canvas>
      <div class="result-modal modal-celebrate">
        <div class="modal-glow" aria-hidden="true"></div>
        <div class="modal-eyebrow">Time's Up</div>
        <h2 class="modal-title" id="modal-title">Session Complete</h2>
        <div class="modal-meta" id="modal-meta"></div>
        <div class="pk-banner" id="pk-banner" hidden></div>
        <div class="modal-stats">
          <div class="modal-stat">
            <div class="modal-stat-value" id="modal-wpm">0</div>
            <div class="modal-stat-label">WPM</div>
          </div>
          <div class="modal-stat">
            <div class="modal-stat-value" id="modal-acc">0%</div>
            <div class="modal-stat-label">Accuracy</div>
          </div>
        </div>
        <div class="modal-missed">
          <div class="modal-missed-label">Most missed keys</div>
          <div class="modal-missed-list" id="modal-missed"></div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary" id="btn-share">Download Certificate Image</button>
          <button type="button" class="btn" id="btn-again">Try Again</button>
        </div>
      </div>
    </div>
  `
}

function cacheEls() {
  el.prompt = document.getElementById('prompt')
  el.hint = document.getElementById('hint')
  el.keyboard = document.getElementById('keyboard')
  el.wpm = document.getElementById('stat-wpm')
  el.acc = document.getElementById('stat-acc')
  el.missed = document.getElementById('stat-missed')
  el.modal = document.getElementById('modal')
  el.modalWpm = document.getElementById('modal-wpm')
  el.modalAcc = document.getElementById('modal-acc')
  el.modalMissed = document.getElementById('modal-missed')
  el.modalMeta = document.getElementById('modal-meta')
  el.pkBanner = document.getElementById('pk-banner')
  el.customPanel = document.getElementById('custom-panel')
  el.customText = document.getElementById('custom-text')
  el.toggleKb = document.getElementById('btn-toggle-kb')
  el.audioBtn = document.getElementById('btn-audio')
  el.timerValue = document.getElementById('timer-value')
  el.timerDisplay = document.getElementById('timer-display')
  el.durationControl = document.getElementById('duration-control')
  el.confetti = document.getElementById('confetti-canvas')
  el.imeBanner = document.getElementById('ime-banner')
  el.authSlot = document.getElementById('auth-slot')
  el.authModal = document.getElementById('auth-modal')
  el.profileWidgets = document.getElementById('profile-widgets')
  el.statPb = document.getElementById('stat-pb')
  el.statRecent = document.getElementById('stat-recent')
  el.viewPractice = document.getElementById('view-practice')
  el.viewRanking = document.getElementById('view-ranking')
  el.leaderboardBody = document.getElementById('leaderboard-body')
  el.leaderboardNote = document.getElementById('leaderboard-note')
}

function bindUiEvents() {
  document.querySelectorAll('.mode-tab').forEach((tab) => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode))
  })

  document.querySelectorAll('.app-nav-tab').forEach((tab) => {
    tab.addEventListener('click', () => setView(tab.dataset.view))
  })

  el.durationControl.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (state.gameState === GameState.TYPING) return
      setDuration(Number(btn.dataset.duration))
    })
  })

  document.getElementById('btn-restart').addEventListener('click', () => startNewRound())
  document.getElementById('btn-again').addEventListener('click', () => {
    closeModal()
    startNewRound()
  })
  document.getElementById('btn-share').addEventListener('click', onShare)
  document.getElementById('btn-custom-start').addEventListener('click', startCustom)
  document.getElementById('custom-file').addEventListener('change', onFileUpload)
  el.toggleKb.addEventListener('click', toggleKeyboard)
  el.audioBtn.addEventListener('click', toggleAudio)

  el.modal.addEventListener('click', (e) => {
    if (e.target === el.modal) closeModal()
  })

  document.getElementById('btn-auth-close').addEventListener('click', closeAuthModal)
  el.authModal.addEventListener('click', (e) => {
    if (e.target === el.authModal) closeAuthModal()
  })
  document.getElementById('btn-google').addEventListener('click', () => handleOAuth('google'))
  document.getElementById('btn-facebook').addEventListener('click', () => handleOAuth('facebook'))

  // Delegate Sign In / Sign Out from auth slot (re-rendered)
  el.authSlot.addEventListener('click', (e) => {
    const t = e.target.closest('[data-auth-action]')
    if (!t) return
    const action = t.dataset.authAction
    if (action === 'signin') openAuthModal()
    if (action === 'signout') handleSignOut()
  })

  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', () => {
    state.isShiftPressed = false
    updateKeyboardLabels()
  })
}

function setView(view) {
  state.activeView = view
  document.querySelectorAll('.app-nav-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.view === view)
  })
  el.viewPractice.hidden = view !== 'practice'
  el.viewRanking.hidden = view !== 'ranking'
  if (view === 'ranking') {
    detachKeydown()
    loadLeaderboard()
  } else if (view === 'practice' && state.gameState !== GameState.FINISHED) {
    attachKeydown()
  }
}

function renderAuthUI() {
  const user = state.user
  if (!user) {
    el.authSlot.innerHTML = `<button type="button" class="btn btn-primary" data-auth-action="signin">Sign In</button>`
    el.profileWidgets.hidden = true
    return
  }

  const avatar = user.avatarUrl
    ? `<img class="auth-avatar" src="${escapeAttr(user.avatarUrl)}" alt="" referrerpolicy="no-referrer" />`
    : `<span class="auth-avatar auth-avatar-fallback">${escapeHtml(user.displayName.charAt(0).toUpperCase())}</span>`

  el.authSlot.innerHTML = `
    <div class="auth-user">
      ${avatar}
      <span class="auth-name">${escapeHtml(user.displayName)}</span>
      <button type="button" class="btn btn-ghost btn-sm" data-auth-action="signout">Sign Out</button>
    </div>
  `
  el.profileWidgets.hidden = false
  renderPersonalWidgets()
}

function escapeAttr(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function openAuthModal() {
  el.authModal.classList.add('open')
  const hint = document.getElementById('auth-config-hint')
  if (hint) hint.hidden = isSupabaseConfigured
}

function closeAuthModal() {
  el.authModal.classList.remove('open')
}

async function handleOAuth(provider) {
  if (!isSupabaseConfigured) {
    openAuthModal()
    return
  }
  try {
    await signInWithProvider(provider)
  } catch (err) {
    console.error(err)
    alert(err.message || 'Sign-in failed. Check Supabase OAuth settings.')
  }
}

async function handleSignOut() {
  try {
    await signOut()
  } catch (err) {
    console.error(err)
  }
}

async function refreshPersonalStats() {
  try {
    const { personalBest, recent } = await fetchPersonalStats()
    state.personalBest = personalBest
    state.recentScore = recent
    renderPersonalWidgets()
  } catch (err) {
    console.error(err)
  }
}

function renderPersonalWidgets() {
  if (!el.statPb || !el.statRecent) return
  if (state.personalBest) {
    el.statPb.textContent = `${state.personalBest.wpm} WPM · ${state.personalBest.accuracy}%`
  } else {
    el.statPb.textContent = state.user ? 'No qualifying run yet' : '—'
  }
  if (state.recentScore) {
    el.statRecent.textContent = `${state.recentScore.wpm} WPM · ${state.recentScore.accuracy}%`
  } else {
    el.statRecent.textContent = state.user ? 'No tests yet' : '—'
  }
}

async function loadLeaderboard() {
  if (!el.leaderboardBody) return
  if (!isSupabaseConfigured) {
    el.leaderboardBody.innerHTML = `<tr><td colspan="5" class="lb-empty">Connect Supabase to enable the global leaderboard.</td></tr>`
    el.leaderboardNote.textContent = 'Guest mode — scores are not ranked until you configure Supabase.'
    return
  }

  el.leaderboardBody.innerHTML = `<tr><td colspan="5" class="lb-empty">Loading…</td></tr>`
  const rows = await fetchLeaderboard(50)

  if (!rows.length) {
    el.leaderboardBody.innerHTML = `<tr><td colspan="5" class="lb-empty">No ranked scores yet. Be the first!</td></tr>`
    el.leaderboardNote.textContent = ''
    return
  }

  el.leaderboardBody.innerHTML = rows
    .map((r) => {
      const name = escapeHtml(r.display_name || 'Learner')
      const avatar = r.avatar_url
        ? `<img class="lb-avatar" src="${escapeAttr(r.avatar_url)}" alt="" referrerpolicy="no-referrer" />`
        : `<span class="lb-avatar lb-avatar-fallback">${name.charAt(0)}</span>`
      const date = r.achieved_at
        ? new Date(r.achieved_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : '—'
      const me = state.user?.id === r.user_id ? ' lb-row-me' : ''
      return `<tr class="${me}">
        <td class="lb-rank">${r.rank}</td>
        <td class="lb-player">${avatar}<span>${name}</span></td>
        <td class="lb-wpm">${r.best_wpm}</td>
        <td>${r.best_accuracy}%</td>
        <td class="lb-date">${date}</td>
      </tr>`
    })
    .join('')

  el.leaderboardNote.textContent = `${rows.length} ranked players · Personal best requires ≥90% accuracy`
}

function attachKeydown() {
  if (state.keydownAttached) return
  window.addEventListener('keydown', onKeyDown)
  state.keydownAttached = true
}

function detachKeydown() {
  if (!state.keydownAttached) return
  window.removeEventListener('keydown', onKeyDown)
  state.keydownAttached = false
}

function setDuration(seconds) {
  if (state.gameState === GameState.TYPING) return
  state.durationSeconds = seconds
  state.remainingMs = seconds * 1000
  el.durationControl.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.duration) === seconds)
  })
  updateTimerDisplay()
  updateDurationLock()
}

function updateDurationLock() {
  const locked = state.gameState === GameState.TYPING
  el.durationControl.classList.toggle('locked', locked)
  el.durationControl.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.disabled = locked
  })
}

function setMode(mode) {
  state.currentMode = mode
  document.querySelectorAll('.mode-tab').forEach((t) => {
    t.classList.toggle('active', t.dataset.mode === mode)
  })

  const isCustom = mode === 'custom'
  el.customPanel.classList.toggle('visible', isCustom)

  if (!isCustom) {
    startNewRound()
  } else {
    stopTimer()
    detachKeydown()
    state.gameState = GameState.FINISHED
    state.targetText = ''
    state.typedText = ''
    state.startedAt = null
    state.remainingMs = state.durationSeconds * 1000
    el.prompt.innerHTML = ''
    el.hint.textContent = 'Paste or upload Thai text, then press Start Practice'
    el.hint.classList.add('visible')
    updateTimerDisplay()
    updateDurationLock()
    updateStatsUI()
    clearKeyHint()
  }
}

function startNewRound() {
  if (state.currentMode === 'custom') {
    if (!el.customText.value.trim()) {
      el.hint.textContent = 'Paste Thai text first'
      el.hint.classList.add('visible')
      return
    }
    state.targetText = normalizeText(el.customText.value)
  } else if (state.currentMode === 'letters') {
    state.targetText = generateLettersText(40)
  } else {
    state.targetText = generateWordsText(18)
  }

  resetSession()
  renderPrompt()
  updateStatsUI()
  updateKeyHint()
  updateTimerDisplay()
  updateDurationLock()
  el.hint.textContent = 'Start typing — timer begins on first keystroke'
  el.hint.classList.add('visible')
  closeModal()
}

function startCustom() {
  const text = normalizeText(el.customText.value)
  if (!text) {
    el.customText.focus()
    return
  }
  state.targetText = text
  resetSession()
  renderPrompt()
  updateStatsUI()
  updateKeyHint()
  updateTimerDisplay()
  updateDurationLock()
  el.hint.textContent = 'Start typing — timer begins on first keystroke'
  el.hint.classList.add('visible')
}

function normalizeText(raw) {
  return raw.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim()
}

function resetSession() {
  stopTimer()
  state.typedText = ''
  state.errorMap = {}
  state.correctKeystrokes = 0
  state.totalKeystrokes = 0
  state.startedAt = null
  state.remainingMs = state.durationSeconds * 1000
  state.finalStats = null
  state.gameState = GameState.READY
  clearImeWarning()
  attachKeydown()
}

/* ── IME / keyboard layout mismatch ── */

function isThaiChar(ch) {
  if (!ch || ch.length === 0) return false
  const code = ch.codePointAt(0)
  return code >= 0x0e00 && code <= 0x0e7f
}

/** ASCII letters / digits / punctuation (not space) — typical wrong-layout output */
function isAsciiLetterOrPunct(key) {
  if (!key || key.length !== 1 || key === ' ') return false
  const code = key.charCodeAt(0)
  return code >= 0x21 && code <= 0x7e
}

/**
 * True when the OS layout is likely English/QWERTY (or similar)
 * while the practice text expects Thai.
 */
function isLayoutMismatch(pressed, expected) {
  if (pressed === expected) return false
  if (!isAsciiLetterOrPunct(pressed)) return false
  // Expecting Thai script, or a space within Thai practice text
  return isThaiChar(expected) || expected === ' '
}

function showImeWarning() {
  if (!el.imeBanner) return
  el.imeBanner.classList.add('visible')
  shakeKeyboard()
}

function clearImeWarning() {
  if (!el.imeBanner) return
  el.imeBanner.classList.remove('visible')
  el.keyboard?.classList.remove('ime-shake')
}

function shakeKeyboard() {
  if (!el.keyboard) return
  el.keyboard.classList.remove('ime-shake')
  void el.keyboard.offsetWidth
  el.keyboard.classList.add('ime-shake')
  const onEnd = () => {
    el.keyboard.classList.remove('ime-shake')
    el.keyboard.removeEventListener('animationend', onEnd)
  }
  el.keyboard.addEventListener('animationend', onEnd)
}

function onFileUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    el.customText.value = String(reader.result || '')
  }
  reader.readAsText(file)
  e.target.value = ''
}

/* ── Timer: only starts on READY → TYPING ── */

function transitionToTyping() {
  if (state.gameState !== GameState.READY) return
  state.gameState = GameState.TYPING
  state.startedAt = performance.now()
  state.remainingMs = state.durationSeconds * 1000
  el.hint.classList.remove('visible')
  updateDurationLock()
  startTimerInterval()
}

function startTimerInterval() {
  stopTimer()
  // Tick every 100ms for smooth countdown UI; WPM updates here too
  state.timerId = window.setInterval(() => {
    if (state.gameState !== GameState.TYPING) {
      stopTimer()
      return
    }
    const elapsed = performance.now() - state.startedAt
    state.remainingMs = Math.max(0, state.durationSeconds * 1000 - elapsed)
    updateTimerDisplay()
    el.wpm.textContent = String(calcWpm(state.correctKeystrokes, elapsed))

    if (state.remainingMs <= 0) {
      onTimerExpired()
    }
  }, 100)
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId)
    state.timerId = 0
  }
}

function updateTimerDisplay() {
  el.timerValue.textContent = formatTime(state.remainingMs)
  el.timerDisplay.classList.toggle(
    'urgent',
    state.gameState === GameState.TYPING && state.remainingMs <= 5000,
  )
  el.timerDisplay.classList.toggle('running', state.gameState === GameState.TYPING)
}

function onTimerExpired() {
  state.remainingMs = 0
  updateTimerDisplay()
  finishSession('timer')
}

/* ── Keyboard rendering ── */

function renderKeyboard() {
  const frag = document.createDocumentFragment()

  KEYBOARD_ROWS.forEach((row, rowIndex) => {
    const rowEl = document.createElement('div')
    rowEl.className = 'kb-row'

    if (rowIndex === 3) {
      const shiftL = document.createElement('div')
      shiftL.className = 'key shift-mod'
      shiftL.dataset.code = 'ShiftLeft'
      shiftL.textContent = 'Shift'
      rowEl.appendChild(shiftL)
    }

    row.forEach((code) => {
      const key = document.createElement('div')
      key.className = 'key'
      key.dataset.code = code
      if (code === 'Space') {
        key.classList.add('space')
        key.textContent = 'space'
      } else if (code === 'Backslash' || code === 'Backquote') {
        key.classList.add('wide')
      }
      rowEl.appendChild(key)
    })

    if (rowIndex === 3) {
      const shiftR = document.createElement('div')
      shiftR.className = 'key shift-mod'
      shiftR.dataset.code = 'ShiftRight'
      shiftR.textContent = 'Shift'
      rowEl.appendChild(shiftR)
    }

    frag.appendChild(rowEl)
  })

  el.keyboard.innerHTML = ''
  el.keyboard.appendChild(frag)
  updateKeyboardLabels()
}

function updateKeyboardLabels() {
  const shifted = state.isShiftPressed
  el.keyboard.querySelectorAll('.key[data-code]').forEach((keyEl) => {
    const code = keyEl.dataset.code
    if (code === 'ShiftLeft' || code === 'ShiftRight') {
      keyEl.classList.toggle('active-shift', shifted)
      return
    }
    if (code === 'Space') return
    const entry = KEDMANEE[code]
    if (!entry) return
    keyEl.textContent = shifted ? entry.shift : entry.normal
  })
}

function flashKey(code, kind) {
  if (!code) return
  const keyEl = el.keyboard.querySelector(`[data-code="${code}"]`)
  if (!keyEl) return
  keyEl.classList.remove('flash-correct', 'flash-wrong')
  void keyEl.offsetWidth
  keyEl.classList.add(kind === 'correct' ? 'flash-correct' : 'flash-wrong')
  setTimeout(() => {
    keyEl.classList.remove('flash-correct', 'flash-wrong')
  }, 160)
}

function updateKeyHint() {
  clearKeyHint()
  if (state.gameState === GameState.FINISHED) return
  const next = state.targetText[state.typedText.length]
  if (next == null) return
  const code = CHAR_TO_CODE.get(next)
  if (!code) return
  const keyEl = el.keyboard.querySelector(`[data-code="${code}"]`)
  if (keyEl) keyEl.classList.add('hint-next')
}

function clearKeyHint() {
  el.keyboard.querySelectorAll('.hint-next').forEach((k) => k.classList.remove('hint-next'))
}

function toggleKeyboard() {
  state.keyboardVisible = !state.keyboardVisible
  el.keyboard.classList.toggle('hidden', !state.keyboardVisible)
  el.toggleKb.textContent = state.keyboardVisible ? 'Hide Keyboard' : 'Show Keyboard'
}

function toggleAudio() {
  state.audioEnabled = !state.audioEnabled
  el.audioBtn.textContent = state.audioEnabled ? 'Sound On' : 'Sound Off'
  if (state.audioEnabled) unlockAudio()
}

/* ── Prompt rendering ── */

function renderPrompt() {
  const target = state.targetText
  const typed = state.typedText
  const windowSize = 80
  let start = 0
  if (typed.length > windowSize / 2) {
    start = Math.max(0, typed.length - Math.floor(windowSize / 3))
  }
  const end = Math.min(target.length, start + windowSize)

  let html = ''
  for (let i = start; i < end; i++) {
    const ch = target[i]
    const display = ch === ' ' ? '&nbsp;' : escapeHtml(ch)
    let cls = 'char pending'
    if (i < typed.length) {
      cls = typed[i] === ch ? 'char correct' : 'char incorrect'
    } else if (i === typed.length) {
      cls = 'char current'
    }
    html += `<span class="${cls}">${display}</span>`
  }

  el.prompt.innerHTML = html
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function appendMoreText() {
  if (state.currentMode === 'custom') return false
  const extra =
    state.currentMode === 'letters' ? generateLettersText(28) : generateWordsText(10)
  state.targetText = `${state.targetText} ${extra}`
  return true
}

/* ── Input handling ── */

function onKeyDown(e) {
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    state.isShiftPressed = true
    updateKeyboardLabels()
    return
  }

  if (state.gameState === GameState.FINISHED) return

  const tag = e.target?.tagName
  if (tag === 'TEXTAREA' || tag === 'INPUT' || e.target?.isContentEditable) return
  if (!state.targetText) return

  if (e.key === 'Backspace') {
    e.preventDefault()
    if (state.typedText.length > 0) {
      state.typedText = state.typedText.slice(0, -1)
      renderPrompt()
      updateKeyHint()
      updateLiveStats()
    }
    return
  }

  if (
    e.key === 'Tab' ||
    e.key === 'Escape' ||
    e.key === 'Enter' ||
    e.key === 'Meta' ||
    e.key === 'Control' ||
    e.key === 'Alt' ||
    e.key === 'CapsLock'
  ) {
    return
  }

  // First valid printable keystroke: READY → TYPING (starts timer)
  if (e.key.length !== 1) return

  e.preventDefault()
  unlockAudio()

  // Peek expected char for IME / layout detection (before starting the timer)
  let expected = state.targetText[state.typedText.length]
  if (expected == null && appendMoreText()) {
    expected = state.targetText[state.typedText.length]
  }
  if (expected == null) return

  const pressed = e.key

  // Wrong OS keyboard language (e.g. English/QWERTY while Thai is expected)
  if (isLayoutMismatch(pressed, expected)) {
    showImeWarning()
    if (state.audioEnabled) playErrorTone()
    return
  }

  // Native Thai (or matching) input — clear any layout warning
  if (isThaiChar(pressed) || pressed === expected || pressed === ' ') {
    clearImeWarning()
  }

  if (state.gameState === GameState.READY) {
    transitionToTyping()
  }

  if (state.gameState !== GameState.TYPING) return

  if (state.typedText.length >= state.targetText.length) {
    if (!appendMoreText()) {
      finishSession('complete')
      return
    }
    expected = state.targetText[state.typedText.length]
    if (expected == null) return
  }

  const code = e.code in KEDMANEE ? e.code : CHAR_TO_CODE.get(pressed)

  state.totalKeystrokes += 1

  if (pressed === expected) {
    state.typedText += pressed
    state.correctKeystrokes += 1
    flashKey(code, 'correct')
    if (state.audioEnabled) speakThaiChar(pressed)
  } else {
    state.errorMap[expected] = (state.errorMap[expected] || 0) + 1
    flashKey(code || CHAR_TO_CODE.get(pressed), 'wrong')
    if (state.audioEnabled) playErrorTone()
  }

  renderPrompt()
  updateKeyHint()
  updateLiveStats()

  if (state.typedText.length >= state.targetText.length) {
    if (state.currentMode === 'custom') {
      finishSession('complete')
    } else {
      appendMoreText()
      renderPrompt()
      updateKeyHint()
    }
  }
}

function onKeyUp(e) {
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
    state.isShiftPressed = e.getModifierState?.('Shift') ?? false
    updateKeyboardLabels()
  }
}

/* ── Stats ── */

function elapsedMs() {
  if (!state.startedAt) return 0
  if (state.gameState === GameState.FINISHED && state.finalStats?.elapsed != null) {
    return state.finalStats.elapsed
  }
  const raw = performance.now() - state.startedAt
  return Math.min(raw, state.durationSeconds * 1000)
}

function currentStats() {
  if (state.finalStats) {
    return {
      wpm: state.finalStats.wpm,
      accuracy: state.finalStats.accuracy,
      missed: state.finalStats.missed,
    }
  }
  const wpm = calcWpm(state.correctKeystrokes, elapsedMs())
  const accuracy = calcAccuracy(state.correctKeystrokes, state.totalKeystrokes)
  const missed = topMissedKeys(state.errorMap, 3)
  return { wpm, accuracy, missed }
}

function updateLiveStats() {
  updateStatsUI()
}

function updateStatsUI() {
  const { wpm, accuracy, missed } = currentStats()
  el.wpm.textContent = String(wpm)
  el.acc.textContent = `${accuracy}%`

  if (missed.length === 0) {
    el.missed.innerHTML = '<span class="missed-empty">—</span>'
  } else {
    el.missed.innerHTML = missed
      .map((m) => `<span class="missed-chip" title="${m.count}×">${escapeHtml(m.char)}</span>`)
      .join('')
  }
}

async function finishSession(reason = 'timer') {
  if (state.gameState === GameState.FINISHED) return

  stopTimer()
  detachKeydown()
  state.gameState = GameState.FINISHED
  state.remainingMs = reason === 'timer' ? 0 : state.remainingMs
  clearKeyHint()

  const elapsed = elapsedMs() || 1
  const wpm = calcWpm(state.correctKeystrokes, elapsed)
  const accuracy = calcAccuracy(state.correctKeystrokes, state.totalKeystrokes)
  const missed = topMissedKeys(state.errorMap, 3)
  state.finalStats = {
    wpm,
    accuracy,
    missed,
    elapsed,
    reason,
    beatPercent: null,
    isNewRecord: false,
  }
  state.beatPercent = null
  state.isNewRecord = false

  updateStatsUI()
  updateTimerDisplay()
  updateDurationLock()

  el.modalMeta.textContent = `${durationLabel()} · ${new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`

  document.getElementById('modal-title').textContent =
    reason === 'timer' ? "Time's Up!" : 'Nice work!'
  document.querySelector('.modal-eyebrow').textContent =
    reason === 'timer' ? 'Timer Complete' : 'Session Complete'

  el.modalWpm.textContent = '0'
  el.modalAcc.textContent = '0%'
  el.pkBanner.hidden = true
  el.pkBanner.textContent = ''

  if (missed.length === 0) {
    el.modalMissed.innerHTML = '<span class="missed-empty">Perfect — no misses!</span>'
  } else {
    el.modalMissed.innerHTML = missed
      .map(
        (m) =>
          `<span class="missed-chip" title="${m.count} errors">${escapeHtml(m.char)}</span>`,
      )
      .join('')
  }

  openModal()
  animateCountUp(el.modalWpm, wpm, { duration: 1500 })
  animateCountUp(el.modalAcc, accuracy, { duration: 1500, suffix: '%' })

  if (state.stopConfetti) state.stopConfetti()
  state.stopConfetti = burstConfetti(el.confetti, { duration: 2400, particleCount: 100 })

  // Persist + PK percentile (signed-in + Supabase only)
  await resolveRankingAndPersist(wpm, accuracy)
}

async function resolveRankingAndPersist(wpm, accuracy) {
  if (!isSupabaseConfigured) {
    el.pkBanner.hidden = false
    el.pkBanner.className = 'pk-banner pk-guest'
    el.pkBanner.textContent = 'Sign in to save scores and compete on the global ranking.'
    return
  }

  if (!getUser()) {
    el.pkBanner.hidden = false
    el.pkBanner.className = 'pk-banner pk-guest'
    el.pkBanner.innerHTML =
      'Playing as guest — <button type="button" class="pk-link" id="pk-signin">Sign in</button> to save &amp; rank this score.'
    document.getElementById('pk-signin')?.addEventListener('click', openAuthModal)
    // Still show global percentile for the raw score
    try {
      const { beatPercent } = await fetchPercentile(wpm)
      if (beatPercent != null) {
        state.beatPercent = beatPercent
        state.finalStats.beatPercent = beatPercent
        el.pkBanner.innerHTML += `<div class="pk-sub">This run would beat <strong>${beatPercent}%</strong> of learners globally.</div>`
      }
    } catch {
      /* ignore */
    }
    return
  }

  let prevBest = null
  try {
    prevBest = await fetchPreviousPersonalBest()
  } catch {
    /* ignore */
  }

  try {
    await saveScore({
      wpm,
      accuracy,
      mode: state.currentMode,
      durationSeconds: state.durationSeconds,
    })
  } catch (err) {
    console.error(err)
    el.pkBanner.hidden = false
    el.pkBanner.className = 'pk-banner pk-error'
    el.pkBanner.textContent = 'Could not save score. Check your connection and try again.'
    return
  }

  const qualifies = accuracy >= 90
  const prevWpm = prevBest?.wpm ?? 0
  const isNewRecord = qualifies && wpm > prevWpm
  state.isNewRecord = isNewRecord
  state.finalStats.isNewRecord = isNewRecord

  try {
    const { beatPercent } = await fetchPercentile(wpm)
    state.beatPercent = beatPercent
    state.finalStats.beatPercent = beatPercent

    if (isNewRecord && beatPercent != null) {
      el.pkBanner.hidden = false
      el.pkBanner.className = 'pk-banner pk-record'
      el.pkBanner.textContent = `🎉 New Record! You just beat ${beatPercent}% of Thai learners globally!`
    } else if (beatPercent != null) {
      el.pkBanner.hidden = false
      el.pkBanner.className = 'pk-banner'
      el.pkBanner.textContent = `You beat ${beatPercent}% of Thai learners globally.`
    }
  } catch (err) {
    console.error(err)
  }

  await refreshPersonalStats()
}

function openModal() {
  el.modal.classList.add('open')
}

function closeModal() {
  el.modal.classList.remove('open')
  if (state.stopConfetti) {
    state.stopConfetti()
    state.stopConfetti = null
  }
}

async function onShare() {
  const { wpm, accuracy, missed } = currentStats()
  const btn = document.getElementById('btn-share')
  const prev = btn.textContent
  btn.textContent = 'Generating…'
  btn.disabled = true
  try {
    await generateCertificate({
      wpm,
      accuracy,
      missed,
      mode: state.currentMode,
      durationLabel: durationLabel(),
      beatPercent: state.beatPercent ?? state.finalStats?.beatPercent ?? null,
      isNewRecord: state.isNewRecord || state.finalStats?.isNewRecord || false,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    })
  } catch (err) {
    console.error(err)
    alert('Could not generate image. Please try again.')
  } finally {
    btn.textContent = prev
    btn.disabled = false
  }
}

init()
