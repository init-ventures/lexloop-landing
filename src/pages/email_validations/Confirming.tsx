import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

type ConfirmState = 'loading' | 'success' | 'error'

export function EmailValidationConfirming() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [state, setState] = useState<ConfirmState>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (!token) {
      setState('error')
      setErrorMessage('Invalid confirmation link')
      return
    }

    // Dev mode: simulate success after delay
    if (import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true') {
      setTimeout(() => {
        setState('success')
        setTimeout(() => {
          navigate(`/meetings/new?user_email=${encodeURIComponent('test@example.com')}`)
        }, 1500)
      }, 1000)
      return
    }

    const confirmEmail = async () => {
      try {
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'email_validations.confirm', token }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Confirmation failed')
        }

        const data = await response.json()
        setState('success')

        // Redirect to booking page after brief success state
        setTimeout(() => {
          navigate(`/meetings/new?user_email=${encodeURIComponent(data.email)}`)
        }, 1500)
      } catch (err) {
        setState('error')
        setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
      }
    }

    confirmEmail()
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {state === 'loading' && (
          <>
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
            </div>
            <h1 className="font-clash text-3xl font-semibold text-text-primary mb-4">
              Confirming your email...
            </h1>
            <p className="text-text-secondary text-lg">
              Just a moment
            </p>
          </>
        )}

        {state === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative inline-flex items-center justify-center mb-8"
            >
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
            <h1 className="font-clash text-3xl font-semibold text-text-primary mb-4">
              Email confirmed
            </h1>
            <p className="text-text-secondary text-lg">
              Redirecting you to confirmation page...
            </p>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="font-clash text-3xl font-semibold text-text-primary mb-4">
              Confirmation failed
            </h1>
            <p className="text-text-secondary text-lg mb-8">
              {errorMessage}
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 text-base font-medium bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors"
            >
              Back to home
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}
