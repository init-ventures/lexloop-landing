import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function EmailValidationPending() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email')
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!email) {
      navigate('/')
      return
    }

    // Dev mode: skip polling, show UI only
    if (import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true') {
      setIsChecking(false)
      return
    }

    const checkStatus = async () => {
      setIsChecking(true)
      try {
        const response = await fetch(`/api/status?email=${encodeURIComponent(email)}`)
        if (!response.ok) throw new Error('Failed to check status')

        const data = await response.json()

        // If confirmed (any status beyond email_confirmation_pending), redirect to booking
        if (data.status && data.status !== 'email_confirmation_pending') {
          navigate(`/meetings/new?user_email=${encodeURIComponent(email)}`)
        }
      } catch (err) {
        console.error('Status check error:', err)
        setError('Unable to check confirmation status')
      } finally {
        setIsChecking(false)
      }
    }

    // Check immediately
    checkStatus()

    // Poll every 5 seconds
    const interval = setInterval(checkStatus, 5000)

    return () => clearInterval(interval)
  }, [email, navigate])

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Email icon with animated ring */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 w-24 h-24 -m-4 rounded-full bg-accent/10 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="relative w-16 h-16 rounded-full bg-accent-subtle flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="font-clash text-3xl font-semibold text-text-primary mb-4">
          Check your inbox
        </h1>

        <p className="text-text-secondary text-lg mb-2">
          We've sent a confirmation link to
        </p>
        <p className="text-text-primary font-medium text-lg mb-8">
          {email}
        </p>

        <div className="bg-bg-card border border-border rounded-xl p-6 text-left space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent-subtle flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-accent text-sm font-semibold">1</span>
            </div>
            <p className="text-text-secondary">
              Open the email from <span className="text-text-primary font-medium">LexLoop</span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent-subtle flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-accent text-sm font-semibold">2</span>
            </div>
            <p className="text-text-secondary">
              Click the confirmation link
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-text-secondary">
          {isChecking ? (
            <>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Checking for confirmation...</span>
            </>
          ) : error ? (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{error}</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-text-secondary/30" />
              <span>Waiting for confirmation</span>
            </>
          )}
        </div>

        <p className="mt-8 text-sm text-text-secondary">
          Didn't receive the email? Check your spam folder.
        </p>

        {/* Dev mode: simulate confirmation link */}
        {import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true' && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800 font-medium mb-2">Dev Mode</p>
            <button
              onClick={() => navigate(`/email_validations/confirming?token=dev-test-token`)}
              className="text-sm text-amber-700 underline hover:text-amber-900"
            >
              Simulate clicking confirmation link
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
