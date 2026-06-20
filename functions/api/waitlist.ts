/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function — POST/GET at /api/waitlist.
// Self-contained waitlist backend on D1 (replaces the old n8n + Railway Postgres setup).
// Persists to D1 first; Slack + Loops side effects are best-effort and never block a signup.

interface Env {
  DB: D1Database
  // All optional — if a key is missing, that integration is skipped (signup still persists).
  LOOPS_API_KEY?: string
  SLACK_BOT_TOKEN?: string
  SLACK_CHANNEL_ID?: string
  SITE_URL?: string // e.g. https://www.lexloop.ai (used in the confirmation link)
}

type WaitlistAction =
  | 'waitlist_registrations.new'
  | 'email_validations.confirm'
  | 'email_validations.status'
  | 'meetings.booked'

interface WaitlistPayload {
  action: WaitlistAction
  email?: string
  token?: string
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const nowISO = () => new Date().toISOString()
const siteUrl = (env: Env) => (env.SITE_URL || 'https://www.lexloop.ai').replace(/\/$/, '')
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// ---- side effects (best-effort) -------------------------------------------

async function logEvent(
  env: Env,
  externalId: string | null,
  email: string | null,
  eventType: string,
  details = '',
): Promise<void> {
  try {
    await env.DB.prepare(
      `INSERT INTO waitlist_events (registration_external_id, registration_email, event_type, details)
       VALUES (?, ?, ?, ?)`,
    )
      .bind(externalId, email, eventType, details)
      .run()
  } catch (e) {
    console.error('logEvent failed:', e)
  }
}

// Posts to Slack and returns the message ts (for threading), or null.
async function slackPost(env: Env, text: string, threadTs?: string | null): Promise<string | null> {
  if (!env.SLACK_BOT_TOKEN || !env.SLACK_CHANNEL_ID) return null
  try {
    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        channel: env.SLACK_CHANNEL_ID,
        text,
        ...(threadTs ? { thread_ts: threadTs } : {}),
      }),
    })
    const data = (await res.json()) as { ok: boolean; ts?: string; error?: string }
    if (!data.ok) console.error('Slack error:', data.error)
    return data.ts ?? null
  } catch (e) {
    console.error('slackPost failed:', e)
    return null
  }
}

async function loops(env: Env, method: 'POST' | 'PUT', path: string, body: unknown): Promise<void> {
  if (!env.LOOPS_API_KEY) return
  try {
    const res = await fetch(`https://app.loops.so/api/v1${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) console.error(`Loops ${path} returned ${res.status}:`, await res.text())
  } catch (e) {
    console.error(`Loops ${path} failed:`, e)
  }
}

const loopsSendConfirmation = (env: Env, email: string, token: string) =>
  Promise.all([
    loops(env, 'POST', '/contacts/create', {
      email,
      confirmationToken: token,
      waitlistStatus: 'pending',
      source: 'waitlist',
    }),
    loops(env, 'POST', '/events/send', {
      email,
      eventName: 'waitlist_registrations.new',
      eventProperties: {
        confirmationToken: token,
        confirmationUrl: `${siteUrl(env)}/email_validations/confirming?token=${token}`,
      },
    }),
  ])

// ---- actions ---------------------------------------------------------------

async function handleNewRegistration(env: Env, email: string): Promise<Response> {
  const externalId = crypto.randomUUID()
  const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, '')

  // Atomic insert-or-skip on the unique email.
  const inserted = await env.DB.prepare(
    `INSERT INTO waitlist_registrations (external_id, email, token, status, confirmation_email_sent_at)
     VALUES (?, ?, ?, 'email_confirmation_pending', ?)
     ON CONFLICT(email) DO NOTHING
     RETURNING external_id, email, token`,
  )
    .bind(externalId, email, token, nowISO())
    .first<{ external_id: string; email: string; token: string }>()

  if (!inserted) {
    // Already registered. Resend the confirmation email if still pending; no duplicate Slack/log.
    const existing = await env.DB.prepare(
      `SELECT email, token, status FROM waitlist_registrations WHERE email = ?`,
    )
      .bind(email)
      .first<{ email: string; token: string; status: string }>()
    if (existing?.status === 'email_confirmation_pending') {
      await loopsSendConfirmation(env, existing.email, existing.token)
    }
    return json({ success: true, email: existing?.email ?? email, token: existing?.token })
  }

  await logEvent(env, inserted.external_id, inserted.email, 'registration.created')
  await logEvent(env, inserted.external_id, inserted.email, 'confirmation_email.sent')

  const ts = await slackPost(env, `:email: New waitlist signup: *${inserted.email}*`)
  if (ts) {
    await env.DB.prepare(`UPDATE waitlist_registrations SET slack_ts = ? WHERE external_id = ?`)
      .bind(ts, inserted.external_id)
      .run()
  }

  await loopsSendConfirmation(env, inserted.email, inserted.token)

  return json({ success: true, email: inserted.email, token: inserted.token })
}

async function handleConfirm(env: Env, token: string): Promise<Response> {
  const row = await env.DB.prepare(
    `SELECT external_id, email, status, slack_ts FROM waitlist_registrations WHERE token = ?`,
  )
    .bind(token)
    .first<{ external_id: string; email: string; status: string; slack_ts: string | null }>()

  if (!row) return json({ error: 'Invalid or expired confirmation link' }, 404)

  // Idempotent: only run side effects on the first confirmation.
  if (row.status === 'email_confirmation_pending') {
    const ts = nowISO()
    await env.DB.prepare(
      `UPDATE waitlist_registrations
       SET status = 'email_confirmed', email_confirmed_at = ?, updated_at = ?
       WHERE token = ?`,
    )
      .bind(ts, ts, token)
      .run()

    await logEvent(env, row.external_id, row.email, 'email.confirmed')
    await slackPost(env, ':white_check_mark: Email confirmed!', row.slack_ts)
    await loops(env, 'PUT', '/contacts/update', { email: row.email, waitlistStatus: 'confirmed' })
    await loops(env, 'POST', '/events/send', { email: row.email, eventName: 'email_validations.confirm' })
  }

  return json({ success: true, email: row.email })
}

async function handleStatus(env: Env, email: string): Promise<Response> {
  const row = await env.DB.prepare(`SELECT status FROM waitlist_registrations WHERE email = ?`)
    .bind(email)
    .first<{ status: string }>()
  return json({ status: row?.status ?? 'not_found' })
}

async function handleMeetingBooked(env: Env, email: string): Promise<Response> {
  const ts = nowISO()
  const row = await env.DB.prepare(
    `UPDATE waitlist_registrations
     SET status = 'meeting_booked', meeting_booked_at = ?, updated_at = ?
     WHERE email = ?
     RETURNING external_id, email, slack_ts`,
  )
    .bind(ts, ts, email)
    .first<{ external_id: string; email: string; slack_ts: string | null }>()

  if (!row) return json({ error: 'Email not found' }, 404)

  await logEvent(env, row.external_id, row.email, 'meeting.booked')
  await slackPost(env, ':calendar: Meeting booked!', row.slack_ts)

  return json({ success: true })
}

// ---- entrypoint ------------------------------------------------------------

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const isGet = request.method === 'GET'
  const isPost = request.method === 'POST'
  if (!isGet && !isPost) return json({ error: 'Method not allowed' }, 405)

  let payload: WaitlistPayload
  if (isGet) {
    const params = new URL(request.url).searchParams
    payload = {
      action: params.get('action') as WaitlistAction,
      email: params.get('email') ?? undefined,
    }
  } else {
    payload = (await request.json().catch(() => ({}))) as WaitlistPayload
  }

  const { action } = payload
  const email = payload.email?.trim().toLowerCase()
  const token = payload.token?.trim()

  if (!action) return json({ error: 'Action is required' }, 400)

  try {
    switch (action) {
      case 'waitlist_registrations.new':
        if (!email || !isEmail(email)) return json({ error: 'A valid email is required' }, 400)
        return await handleNewRegistration(env, email)

      case 'email_validations.status':
        if (!email) return json({ error: 'Email is required for status check' }, 400)
        return await handleStatus(env, email)

      case 'email_validations.confirm':
        if (!token) return json({ error: 'Token is required for confirmation' }, 400)
        return await handleConfirm(env, token)

      case 'meetings.booked':
        if (!email || !isEmail(email)) return json({ error: 'A valid email is required' }, 400)
        return await handleMeetingBooked(env, email)

      default:
        return json({ error: 'Unknown action' }, 400)
    }
  } catch (e) {
    console.error('Waitlist handler error:', e)
    return json({ error: 'Failed to process request' }, 500)
  }
}
