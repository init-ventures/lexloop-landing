import { useState } from 'react'
import { motion } from 'framer-motion'

export function Footer() {
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
    <footer className="py-20 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-clash text-2xl sm:text-3xl font-semibold text-text-primary mb-4">
            Ready to stop dreading contract review?
          </h2>

          {submitted ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent-subtle rounded-xl">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-accent font-medium">You're on the list. We'll be in touch.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@startup.com"
                className="w-full sm:w-64 px-4 py-3 text-base bg-bg-card border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 text-base font-medium bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </form>
          )}
        </motion.div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          {/* Logo */}
          <a href="/" className="font-clash text-lg font-semibold text-text-primary">
            LexLoop
          </a>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <span className="hidden sm:inline">·</span>
            <span className="text-text-secondary/70">Built by founders who've been there</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
