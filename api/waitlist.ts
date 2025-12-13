import type { VercelRequest, VercelResponse } from '@vercel/node'

type WaitlistAction =
  | 'waitlist_registrations.new'
  | 'email_validations.confirm'
  | 'email_validations.status'

interface WaitlistPayload {
  action: WaitlistAction
  email?: string
  token?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow both GET (for status) and POST (for register/confirm)
  const isGet = req.method === 'GET'
  const isPost = req.method === 'POST'

  if (!isGet && !isPost) {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Build payload from query params (GET) or body (POST)
  const payload: WaitlistPayload = isGet
    ? { action: req.query.action as WaitlistAction, email: req.query.email as string }
    : req.body

  const { action, email, token } = payload

  if (!action) {
    return res.status(400).json({ error: 'Action is required' })
  }

  // Validate required fields per action
  if (action === 'waitlist_registrations.new' && !email) {
    return res.status(400).json({ error: 'Email is required for registration' })
  }
  if (action === 'email_validations.confirm' && !token) {
    return res.status(400).json({ error: 'Token is required for confirmation' })
  }
  if (action === 'email_validations.status' && !email) {
    return res.status(400).json({ error: 'Email is required for status check' })
  }

  const webhookUrl = process.env.N8N_WAITLIST_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('N8N_WAITLIST_WEBHOOK_URL not configured')
    return res.status(500).json({ error: 'Server configuration error' })
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
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error calling n8n webhook:', error)
    return res.status(500).json({ error: 'Failed to process request' })
  }
}
