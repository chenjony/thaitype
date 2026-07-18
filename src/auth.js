import { supabase, isSupabaseConfigured } from './lib/supabase.js'

/** @typedef {{ id: string, email?: string, username?: string, displayName: string, avatarUrl: string | null, countryCode?: string }} AuthUser */

const listeners = new Set()

/** @type {AuthUser | null} */
let currentUser = null
let ready = false

function meta(user) {
  const m = user.user_metadata || {}
  return {
    id: user.id,
    email: user.email,
    username: m.username,
    displayName:
      m.full_name || m.name || m.user_name || (user.email ? user.email.split('@')[0] : 'Learner'),
    avatarUrl: m.avatar_url || m.picture || null,
    countryCode: m.country_code || '',
  }
}

async function withProfile(user) {
  const base = meta(user)
  const { data } = await supabase.from('profiles').select('username, display_name, avatar_url, country_code').eq('id', user.id).maybeSingle()
  return data ? { ...base, username: data.username || base.username, displayName: data.display_name || base.displayName, avatarUrl: data.avatar_url || base.avatarUrl, countryCode: data.country_code || '' } : base
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
  currentUser = data.session?.user ? await withProfile(data.session.user) : null
  ready = true
  emit()

  supabase.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user ? await withProfile(session.user) : null
    emit()
  })
}

/** OAuth return URL — production site, never localhost in prod builds */
function authRedirectTo() {
  const fromEnv = import.meta.env.VITE_SITE_URL
  if (fromEnv) return String(fromEnv).replace(/\/$/, '')
  if (import.meta.env.PROD) return 'https://thaitypes.com'
  return window.location.origin
}

/**
 * @param {'google' | 'facebook' | 'custom:wechat' | 'custom:line'} provider
 */
export async function signInWithProvider(provider) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: authRedirectTo(),
      queryParams:
        provider === 'google'
          ? { access_type: 'offline', prompt: 'consent' }
          : undefined,
    },
  })

  if (error) throw error
}

export async function signUpWithPassword({ username, email, password, displayName, countryCode }) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: authRedirectTo(),
      data: { username: username.toLowerCase(), display_name: displayName || username, country_code: countryCode },
    },
  })
  if (error) throw error
  return data
}

export async function signInWithPassword(identifier, password) {
  if (!supabase) throw new Error('Supabase is not configured.')
  if (identifier.includes('@')) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: identifier, password })
    if (error) throw error
    return data
  }
  const { data, error } = await supabase.functions.invoke('username-login', { body: { username: identifier, password } })
  if (error) throw error
  if (!data?.access_token || !data?.refresh_token) throw new Error(data?.error || 'Username sign-in failed.')
  const { data: session, error: sessionError } = await supabase.auth.setSession({ access_token: data.access_token, refresh_token: data.refresh_token })
  if (sessionError) throw sessionError
  return session
}

export async function requestPasswordReset(email) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${authRedirectTo()}/?reset=1` })
  if (error) throw error
}

export async function updatePassword(password) {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}

export async function updateProfile({ displayName, countryCode, avatarFile }) {
  if (!supabase || !currentUser) throw new Error('Sign in first.')
  let avatarUrl = currentUser.avatarUrl
  if (avatarFile) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(avatarFile.type) || avatarFile.size > 2 * 1024 * 1024) throw new Error('Avatar must be a JPG, PNG, or WebP under 2 MB.')
    const extension = avatarFile.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${currentUser.id}/avatar.${extension}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true, contentType: avatarFile.type })
    if (uploadError) throw uploadError
    avatarUrl = `${supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl}?v=${Date.now()}`
  }
  const { data, error } = await supabase.from('profiles').update({ display_name: displayName, country_code: countryCode || null, avatar_url: avatarUrl }).eq('id', currentUser.id).select('username, display_name, avatar_url, country_code').single()
  if (error) throw error
  await supabase.auth.updateUser({ data: { display_name: data.display_name, avatar_url: data.avatar_url, country_code: data.country_code } })
  currentUser = { ...currentUser, displayName: data.display_name, avatarUrl: data.avatar_url, countryCode: data.country_code || '' }
  emit()
  return currentUser
}

export async function signOut() {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  currentUser = null
  emit()
}

export { isSupabaseConfigured }
