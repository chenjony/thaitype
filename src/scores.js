import { supabase, isSupabaseConfigured } from './lib/supabase.js'
import { getUser } from './auth.js'

/**
 * Persist a completed session for the signed-in user.
 */
export async function saveScore({ wpm, accuracy, mode, durationSeconds }) {
  const user = getUser()
  if (!user || !supabase) return null

  const { data, error } = await supabase
    .from('user_scores')
    .insert({
      user_id: user.id,
      wpm,
      accuracy,
      mode,
      duration_seconds: durationSeconds,
    })
    .select()
    .single()

  if (error) {
    console.error('saveScore', error)
    throw error
  }
  return data
}

/**
 * Personal Best (accuracy >= 90) + most recent test.
 */
export async function fetchPersonalStats() {
  const user = getUser()
  if (!user || !supabase) {
    return { personalBest: null, recent: null }
  }

  const { data: recentRows, error: recentErr } = await supabase
    .from('user_scores')
    .select('wpm, accuracy, mode, duration_seconds, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  if (recentErr) console.error(recentErr)

  const { data: bestRows, error: bestErr } = await supabase
    .from('user_scores')
    .select('wpm, accuracy, mode, duration_seconds, created_at')
    .eq('user_id', user.id)
    .gte('accuracy', 90)
    .order('wpm', { ascending: false })
    .limit(1)

  if (bestErr) console.error(bestErr)

  return {
    personalBest: bestRows?.[0] ?? null,
    recent: recentRows?.[0] ?? null,
  }
}

/**
 * Current personal best WPM (accuracy >= 90) before saving a new score.
 */
export async function fetchPreviousPersonalBest() {
  const user = getUser()
  if (!user || !supabase) return null

  const { data, error } = await supabase
    .from('user_scores')
    .select('wpm, accuracy')
    .eq('user_id', user.id)
    .gte('accuracy', 90)
    .order('wpm', { ascending: false })
    .limit(1)

  if (error) {
    console.error(error)
    return null
  }

  return data?.[0] ?? { wpm: 0, accuracy: 0 }
}

/**
 * Percentile vs all users' personal bests.
 * Formula: (users with lower high score / total users) * 100
 */
export async function fetchPercentile(wpm) {
  if (!supabase || !isSupabaseConfigured) {
    return { beatPercent: null, totalUsers: 0, usersBelow: 0 }
  }

  const { data, error } = await supabase.rpc('get_percentile', { score_wpm: wpm })
  if (error) {
    console.error('get_percentile', error)
    return { beatPercent: null, totalUsers: 0, usersBelow: 0 }
  }

  const row = Array.isArray(data) ? data[0] : data
  return {
    beatPercent: row?.beat_percent != null ? Number(row.beat_percent) : null,
    totalUsers: Number(row?.total_users ?? 0),
    usersBelow: Number(row?.users_below ?? 0),
  }
}

/**
 * Top 50 global ranking by personal best (accuracy >= 90).
 */
export async function fetchLeaderboard(limit = 50) {
  if (!supabase || !isSupabaseConfigured) return []

  const { data, error } = await supabase.rpc('get_leaderboard', { limit_count: limit })
  if (error) {
    console.error('get_leaderboard', error)
    return []
  }
  return data || []
}
