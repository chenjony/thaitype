import html2canvas from 'html2canvas'

/**
 * Build a shareable certificate card and download as PNG.
 */
export async function generateCertificate({
  wpm,
  accuracy,
  missed,
  mode,
  date,
  durationLabel,
  beatPercent = null,
  isNewRecord = false,
}) {
  const card = document.createElement('div')
  card.className = 'cert-card'
  card.setAttribute('aria-hidden', 'true')

  const missedHtml =
    missed.length > 0
      ? missed.map((m) => `<span class="cert-miss">${escapeHtml(m.char)}</span>`).join('')
      : '<span class="cert-miss-none">None</span>'

  const pkHtml =
    beatPercent != null
      ? `<div class="cert-pk">${isNewRecord ? '🎉 New Record! ' : ''}You beat <strong>${escapeHtml(String(beatPercent))}%</strong> of Thai learners globally</div>`
      : ''

  card.innerHTML = `
    <div class="cert-brand">Thai</div>
    <div class="cert-title">Session Complete</div>
    <div class="cert-date">${escapeHtml(date)} · ${escapeHtml(durationLabel)}</div>
    <div class="cert-stats">
      <div class="cert-stat">
        <div class="cert-stat-value">${wpm}</div>
        <div class="cert-stat-label">WPM</div>
      </div>
      <div class="cert-stat">
        <div class="cert-stat-value">${accuracy}%</div>
        <div class="cert-stat-label">Accuracy</div>
      </div>
    </div>
    ${pkHtml}
    <div class="cert-mode">${escapeHtml(modeLabel(mode))} · ${escapeHtml(durationLabel)}</div>
    <div class="cert-missed-label">Most missed</div>
    <div class="cert-missed">${missedHtml}</div>
    <div class="cert-footer">thaitype · practice makes perfect</div>
  `

  document.body.appendChild(card)

  try {
    const canvas = await html2canvas(card, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    })
    const link = document.createElement('a')
    link.download = `thaitype-${wpm}wpm-${accuracy}pct.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally {
    card.remove()
  }
}

function modeLabel(mode) {
  if (mode === 'letters') return 'Letters Mode'
  if (mode === 'words') return 'Words Mode'
  return 'Custom Mode'
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
