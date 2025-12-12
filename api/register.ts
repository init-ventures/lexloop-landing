import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }

  const webhookUrl = process.env.N8N_REGISTER_WEBHOOK_URL

  if (!webhookUrl) {
    console.error('N8N_REGISTER_WEBHOOK_URL not configured')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error(`n8n webhook returned ${response.status}`)
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error calling n8n webhook:', error)
    return res.status(500).json({ error: 'Failed to process registration' })
  }
}
