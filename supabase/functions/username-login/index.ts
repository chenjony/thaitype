import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const { username, password } = await request.json()
    if (!/^[a-z0-9_.-]{3,30}$/i.test(username || '') || typeof password !== 'string') throw new Error('Invalid credentials.')

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
    const { data: profile } = await admin.from('profiles').select('id').ilike('username', username).maybeSingle()
    if (!profile) throw new Error('Invalid credentials.')
    const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.id)
    if (userError || !userData.user?.email) throw new Error('Invalid credentials.')

    const client = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { auth: { persistSession: false } })
    const { data, error } = await client.auth.signInWithPassword({ email: userData.user.email, password })
    if (error || !data.session) throw new Error('Invalid credentials.')
    return Response.json({ access_token: data.session.access_token, refresh_token: data.session.refresh_token }, { headers: cors })
  } catch {
    return Response.json({ error: 'Invalid username or password.' }, { status: 401, headers: cors })
  }
})
