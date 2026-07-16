'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function PaymentPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    if (!user.email_confirmed_at) {
      router.push('/verify-email')
      return
    }

    setUser(user)
    setLoading(false)
  }

  const handleSubmitPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const transactionReference = formData.get('transaction_reference') as string
    const amount = formData.get('amount') as string

    try {
      // Get user's registration
      const { data: registration } = await supabase
        .from('registrations')
        .select('id, status')
        .eq('user_id', user.id)
        .maybeSingle()

      const reg = registration as any

      if (reg && reg.status === 'approved') {
        router.push('/portal')
        return
      }

      // Create or update registration
      const { error: regError } = await supabase
        .from('registrations')
        .upsert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          email: user.email,
          phone: user.user_metadata?.phone || '',
          transaction_reference: transactionReference,
          payment_method: 'airtel_money',
          amount: parseFloat(amount),
          status: 'pending',
        } as any, {
          onConflict: 'user_id'
        })

      if (regError) {
        console.error('Registration error:', regError)
        setError('Failed to submit payment. Please try again.')
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/portal/status')
      }, 2000)
    } catch (err) {
      console.error('Payment submission error:', err)
      setError('An error occurred. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/70">Loading...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full">
          <div className="glass-strong p-12 rounded-2xl space-y-8 text-center">
            <div className="text-6xl">✅</div>
            <h1 className="text-4xl font-bold text-foreground">Payment Submitted!</h1>
            <p className="text-lg text-foreground/80">
              We're verifying your Airtel Money payment. You'll receive access within 24 hours.
            </p>
            <p className="text-sm text-foreground/60">
              Redirecting to your status page...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Complete Your Payment</h1>
          <p className="text-lg text-foreground/70">
            Your spot is reserved! Submit your Airtel Money payment to unlock the masterclass.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Instructions */}
          <div className="glass-strong p-8 rounded-2xl space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Payment Details</h2>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl space-y-2">
                <p className="text-sm font-semibold text-green-800">Amount to Pay</p>
                <p className="text-4xl font-bold text-primary">ZMW 400</p>
                <p className="text-xs text-green-700">Early Bird Price</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-foreground/70">Airtel Money Number</p>
                  <p className="text-xl font-bold text-foreground font-mono">+260 97 123 4567</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground/70">Account Name</p>
                  <p className="text-lg font-semibold text-foreground">Pig Farming Masterclass</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> After payment, enter your Airtel Money transaction reference below.
                  You can find this in your Airtel Money transaction history.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="glass-strong p-8 rounded-2xl space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Submit Payment Proof</h2>

            <form onSubmit={handleSubmitPayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Airtel Money Transaction Reference <span className="text-red-500">*</span>
                </label>
                <input
                  name="transaction_reference"
                  type="text"
                  required
                  placeholder="e.g., TXN123456789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-foreground/60 mt-1">
                  Find this in your Airtel Money SMS or transaction history
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount Paid (ZMW) <span className="text-red-500">*</span>
                </label>
                <input
                  name="amount"
                  type="number"
                  defaultValue={400}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full gradient-accent text-white py-4 text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                {submitting ? 'Submitting...' : 'Submit Payment Confirmation'}
              </Button>

              <p className="text-xs text-foreground/60 text-center">
                By submitting, you confirm that you have made the payment to the Airtel Money number above.
              </p>
            </form>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="mt-12 glass p-8 rounded-2xl space-y-4">
          <h3 className="text-xl font-bold text-foreground">What Happens Next?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-3xl">📝</div>
              <p className="font-semibold text-foreground">1. Submit Payment</p>
              <p className="text-sm text-foreground/70">Enter your transaction reference</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">✅</div>
              <p className="font-semibold text-foreground">2. Verification</p>
              <p className="text-sm text-foreground/70">We verify your payment (24 hours)</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🎉</div>
              <p className="font-semibold text-foreground">3. Access Granted</p>
              <p className="text-sm text-foreground/70">Get full access to the portal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}