import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Navbar() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEmailValid = email.length > 0 && EMAIL_REGEX.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isEmailValid) return

    setIsSubmitting(true)

    // Dev mode: skip API call
    if (import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true') {
      await new Promise(r => setTimeout(r, 300))
      navigate(`/email_validations/pending?email=${encodeURIComponent(email)}`)
      return
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'waitlist_registrations.new', email }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      navigate(`/email_validations/pending?email=${encodeURIComponent(email)}`)
    } catch (err) {
      console.error('Registration error:', err)
      setIsSubmitting(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-clash text-xl font-semibold text-text-primary">
          LexLoop
        </a>

        {/* CTA */}
        <div className="hidden sm:block">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@startup.com"
              className="w-48 px-3 py-2 text-sm bg-bg-card border border-border rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting || !isEmailValid}
              className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '...' : 'Join Waitlist'}
            </button>
          </form>
        </div>

        {/* Mobile CTA */}
        <a
          href="#waitlist"
          className="sm:hidden px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          Join Waitlist
        </a>
      </div>
    </nav>
  )
}
