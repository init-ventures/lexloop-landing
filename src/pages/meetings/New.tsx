import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Cal, { getCalApi } from '@calcom/embed-react'

export function MeetingsNew() {
  const [searchParams] = useSearchParams()
  const userEmail = searchParams.get('user_email')

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: 'lexloop-ai' })
      cal('ui', {
        theme: 'light',
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
  }, [])

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="border-b border-border bg-bg-base/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-clash text-xl font-semibold text-text-primary">
            LexLoop
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-subtle rounded-full mb-6">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-accent font-medium">You're on the waitlist</span>
          </div>

          <h1 className="font-clash text-3xl sm:text-4xl font-semibold text-text-primary mb-4">
            Let's talk about your legal workflow
          </h1>

          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Book a 20-minute call with Nicolas, our founder.
            He'll walk you through how LexLoop can transform how you handle contracts.
          </p>
        </motion.div>

        {/* Cal.com embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-lg"
        >
          <div className="h-[600px]">
            <Cal
              namespace="lexloop-ai"
              calLink="nfilzi/lexloop-ai"
              style={{ width: '100%', height: '100%', overflow: 'scroll' }}
              config={{
                layout: 'month_view',
                theme: 'light',
                ...(userEmail && { email: userEmail }),
              }}
            />
          </div>
        </motion.div>

        {/* Alternative: Skip booking */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-text-secondary">
            Not ready to chat yet?{' '}
            <a href="/" className="text-accent hover:underline">
              We'll be in touch when LexLoop launches
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
