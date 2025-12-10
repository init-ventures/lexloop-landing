import { useState } from 'react'

export function Navbar() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // Placeholder - will wire up actual endpoint later
    await new Promise(resolve => setTimeout(resolve, 500))
    setSubmitted(true)
    setIsSubmitting(false)
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
          {submitted ? (
            <span className="text-sm text-accent font-medium">
              You're on the list
            </span>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@startup.com"
                className="w-48 px-3 py-2 text-sm bg-bg-card border border-border rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '...' : 'Join Waitlist'}
              </button>
            </form>
          )}
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
