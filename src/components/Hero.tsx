import { useState } from 'react'
import { motion } from 'framer-motion'

export function Hero() {
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
    <section className="pt-32 pb-20 px-6" id="waitlist">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-clash text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-primary leading-tight"
        >
          Contracts shouldn't require
          <br />
          <span className="text-accent">a law degree.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
        >
          You're building a company, not studying for the bar. LexLoop turns dense legal documents into structured, navigable data — so you can understand what you're signing without billing a lawyer by the hour.
        </motion.p>

        {/* CTA Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
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
                {isSubmitting ? 'Joining...' : 'Join the Waitlist'}
              </button>
            </form>
          )}
          <p className="mt-4 text-sm text-text-secondary">
            Early access launching Q1 2025. No spam, ever.
          </p>
        </motion.div>

        {/* POC Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 relative"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent blur-3xl -z-10 scale-110" />

          {/* Screenshot container */}
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-accent/10 bg-bg-card">
            {/* Placeholder for POC screenshot - replace with actual image */}
            <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
              <div className="text-center text-text-secondary">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">POC Screenshot</p>
                <p className="text-xs mt-1">Add poc-full.png to src/assets/</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
