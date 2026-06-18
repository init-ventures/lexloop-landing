/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function — serves GET/POST at /api/waitlist.
// Ported from the previous Vercel serverless function (api/waitlist.ts).

interface Env {
  N8N_WAITLIST_WEBHOOK_URL: string
}

type WaitlistAction =
  | 'waitlist_registrations.new'
  | 'email_validations.confirm'
  | 'email_validations.status'

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

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const isGet = request.method === 'GET'
  const isPost = request.method === 'POST'

  if (!isGet && !isPost) {
    return json({ error: 'Method not allowed' }, 405)
  }

  // Build payload from query params (GET) or body (POST)
  let payload: WaitlistPayload
  if (isGet) {
    const params = new URL(request.url).searchParams
    payload = {
      action: params.get('action') as WaitlistAction,
      email: params.get('email') ?? undefined,
    }
  } else {
    payload = (await request.json()) as WaitlistPayload
  }

  const { action, email, token } = payload

  if (!action) {
    return json({ error: 'Action is required' }, 400)
  }

  // Validate required fields per action
  if (action === 'waitlist_registrations.new' && !email) {
    return json({ error: 'Email is required for registration' }, 400)
  }
  if (action === 'email_validations.confirm' && !token) {
    return json({ error: 'Token is required for confirmation' }, 400)
  }
  if (action === 'email_validations.status' && !email) {
    return json({ error: 'Email is required for status check' }, 400)
  }

  const webhookUrl = env.N8N_WAITLIST_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('N8N_WAITLIST_WEBHOOK_URL not configured')
    return json({ error: 'Server configuration error' }, 500)
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`n8n webhook returned ${response.status}`)
    }

    const data = await response.json()
    return json(data, 200)
  } catch (error) {
    console.error('Error calling n8n webhook:', error)
    return json({ error: 'Failed to process request' }, 500)
  }
}
