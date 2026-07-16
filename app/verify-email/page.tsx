'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get email from sessionStorage or current user
    const storedEmail = sessionStorage.getItem('pendingEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    }

    // Check if user is already verified
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user && user.email_confirmed_at) {
      // User is verified, redirect to payment
      router.push('/payment')
    }
  }

  const handleResendEmail = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Verification email sent! Please check your inbox.')
      }
    } catch (err) {
      setError('Failed to resend email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = () => {
    router.push('/payment')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full">
        <div className="glass-strong p-12 rounded-2xl space-y-8 text-center">
          {/* Email Icon */}
          <div className="text-6xl">📧</div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Verify Your Email
            </h1>
            <p className="text-lg text-foreground/80">
              We've sent a confirmation link to your email address
            </p>
          </div>

          {/* Email Display */}
          <div className="glass p-6 rounded-xl space-y-2">
            <p className="text-sm font-semibold text-foreground/70">Email Address</p>
            <p className="text-2xl font-bold text-primary">{email || 'your@email.com'}</p>
          </div>

          {/* Instructions */}
          <div className="space-y-4 text-left bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <h3 className="font-bold text-blue-900 text-lg">Next Steps:</h3>
            <ol className="space-y-3 text-blue-800">
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">1.</span>
                <span>Open your email inbox</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">2.</span>
                <span>Find the email from Pig Farming Masterclass</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">3.</span>
                <span>Click the confirmation link</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-blue-600">4.</span>
                <span>Return here to continue</span>
              </li>
            </ol>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              size="lg"
              className="w-full gradient-accent text-white py-4 hover:shadow-2xl transition-all hover:scale-105"
            >
              I've Verified My Email - Continue
            </Button>

            <Button
              onClick={handleResendEmail}
              disabled={loading}
              variant="outline"
              size="lg"
              className="w-full"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </div>

          {/* Help Text */}
          <div className="space-y-2 text-sm text-foreground/60">
            <p>Didn't receive the email? Check your spam folder.</p>
            <p>Still having issues? Contact us at support@pigfarmingmasterclass.com</p>
          </div>

          {/* Login Link */}
          <div className="pt-4 border-t border-white/20">
            <p className="text-sm text-foreground/70">
              Already verified?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-primary font-semibold hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}