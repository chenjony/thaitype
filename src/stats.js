/**
 * Thai typing stats.
 * WPM: Thai has no spaces between words in the same way as English.
 * We use the common standard: (correct characters / 5) / minutes.
 */
export function calcWpm(correctChars, elapsedMs) {
  if (elapsedMs <= 0) return 0
  const minutes = elapsedMs / 60000
  return Math.round((correctChars / 5) / minutes)
}

export function calcAccuracy(correct, total) {
  if (total <= 0) return 100
  return Math.round((correct / total) * 100)
}

export function topMissedKeys(errorMap, limit = 3) {
  return Object.entries(errorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([char, count]) => ({ char, count }))
}
