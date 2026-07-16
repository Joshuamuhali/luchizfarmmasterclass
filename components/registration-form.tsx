'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface FormData {
  full_name: string
  phone: string
  email: string
  nrc?: string
  transaction_reference: string
  payment_method: string
  amount: number
}

interface RegistrationFormProps {
  onSuccess: (data: { registrationId: number }) => void
  userId?: string
}

export function RegistrationForm({ onSuccess, userId }: RegistrationFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const [apiError, setApiError] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const onSubmit = async (data: FormData) => {
    setApiError('')
    try {
      // If userId is not provided, get it from the current session
      let currentUserId = userId
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setApiError('You must be logged in to register')
          return
        }
        currentUserId = user.id
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          user_id: currentUserId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setApiError(result.error || 'Registration failed')
        return
      }

      setSuccess(true)
      onSuccess({
        registrationId: result.registration.id,
      })
    } catch (error) {
      setApiError('An error occurred. Please try again.')
      console.error('Form submission error:', error)
    }
  }

  if (success) {
    return (
      <div className="glass-strong p-8 rounded-2xl text-center space-y-4">
        <div className="text-6xl">✅</div>
        <h3 className="text-2xl font-bold text-foreground">Registration Submitted!</h3>
        <p className="text-foreground/70">
          Your registration has been received. We're verifying your Airtel Money payment.
          You'll receive access to the portal once approved.
        </p>
        <p className="text-sm text-foreground/60">
          Please check your email for updates.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Payment Instructions */}
      <div className="glass-strong p-6 rounded-2xl space-y-4 border-2 border-primary/20">
        <h3 className="text-xl font-bold text-foreground">💳 Payment Instructions</h3>
        
        <div className="space-y-3 text-foreground/80">
          <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg">
            <span className="font-semibold">Amount:</span>
            <span className="text-2xl font-bold text-primary">ZMW {process.env.NEXT_PUBLIC_PAYMENT_AMOUNT || '400'}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg">
            <span className="font-semibold">Airtel Money Number:</span>
            <span className="font-mono">{process.env.NEXT_PUBLIC_AIRTEL_NUMBER || '+260 97 123 4567'}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white/30 rounded-lg">
            <span className="font-semibold">Account Name:</span>
            <span className="font-semibold">{process.env.NEXT_PUBLIC_ACCOUNT_NAME || 'Pig Farming Masterclass'}</span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> After payment, enter your Airtel Money transaction reference below.
            Keep your transaction ID safe for verification.
          </p>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register('full_name', { required: 'Name is required' })}
          type="text"
          placeholder="Enter your full name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.full_name && <span className="text-red-500 text-sm">{errors.full_name.message}</span>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          {...register('phone', { required: 'Phone number is required' })}
          type="tel"
          placeholder="+260..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          {...register('email', { required: 'Email is required' })}
          type="email"
          placeholder="your@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
      </div>

      {/* NRC (Optional) */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          NRC (Optional)
        </label>
        <input
          {...register('nrc')}
          type="text"
          placeholder="Your NRC number"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Transaction Reference */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Airtel Money Transaction Reference <span className="text-red-500">*</span>
        </label>
        <input
          {...register('transaction_reference', { required: 'Transaction reference is required' })}
          type="text"
          placeholder="e.g., TXN123456789"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.transaction_reference && <span className="text-red-500 text-sm">{errors.transaction_reference.message}</span>}
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <select
          {...register('payment_method', { required: 'Payment method is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="airtel_money">Airtel Money</option>
        </select>
        {errors.payment_method && <span className="text-red-500 text-sm">{errors.payment_method.message}</span>}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Amount Paid (ZMW) <span className="text-red-500">*</span>
        </label>
        <input
          {...register('amount', { required: 'Amount is required', valueAsNumber: true })}
          type="number"
          defaultValue={400}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.amount && <span className="text-red-500 text-sm">{errors.amount.message}</span>}
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {apiError}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gradient-accent text-white py-3 rounded-lg font-semibold"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Registration'}
      </Button>

      <p className="text-xs text-foreground/60 text-center">
        By submitting, you confirm that you have made the payment and provide accurate information.
        Your registration will be reviewed within 24-48 hours.
      </p>
    </form>
  )
}