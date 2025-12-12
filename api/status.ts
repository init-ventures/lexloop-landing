import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = req.query.email as string

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const webhookUrl = process.env.N8N_STATUS_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('N8N_STATUS_WEBHOOK_URL not configured')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const url = new URL(webhookUrl)
    url.searchParams.set('email', email)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`n8n webhook returned ${response.status}`)
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error calling n8n webhook:', error)
    return res.status(500).json({ error: 'Failed to get status' })
  }
}
