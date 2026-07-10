import { supabase, isSupabaseConfigured } from './lib/supabase.js'

/** @typedef {{ id: string, email?: string, displayName: string, avatarUrl: string | null }} AuthUser */

const listeners = new Set()

/** @type {AuthUser | null} */
let currentUser = null
let ready = false

function meta(user) {
  const m = user.user_metadata || {}
  return {
    id: user.id,
    email: user.email,
    displayName:
      m.full_name || m.name || m.user_name || (user.email ? user.email.split('@')[0] : 'Learner'),
    avatarUrl: m.avatar_url || m.picture || null,
  }
}

function emit() {
  for (const fn of listeners) fn(currentUser)
}

export function isAuthReady() {
  return ready
}

export function getUser() {
  return currentUser
}

export function isSignedIn() {
  return Boolean(currentUser)
}

export function onAuthChange(fn) {
  listeners.add(fn)
  if (ready) fn(currentUser)
  return () => listeners.delete(fn)
}

export async function initAuth() {
  if (!isSupabaseConfigured || !supabase) {
    ready = true
    emit()
    return
  }

  const { data } = await supabase.auth.getSession()
  currentUser = data.session?.user ? meta(data.session.user) : null
  ready = true
  emit()

  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ? meta(session.user) : null
    emit()
  })
}

/**
 * @param {'google' | 'facebook'} provider
 */
export async function signInWithProvider(provider) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
      queryParams:
        provider === 'google'
          ? { access_type: 'offline', prompt: 'consent' }
          : undefined,
    },
  })

  if (error) throw error
}

export async function signOut() {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  currentUser = null
  emit()
}

export { isSupabaseConfigured }
