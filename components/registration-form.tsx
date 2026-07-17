'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { calculateLeadScore, type QuestionnaireAnswers, type LeadQualificationResult } from '@/components/lead-qualification-engine'

interface FormData {
  full_name: string
  phone: string
  email: string
  current_farming_status: string
  start_timeline: string
  has_land: string
  main_challenge: string
  joining_reason: string
  investment_status: string
}

export function RegistrationForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>()
  const [apiError, setApiError] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [qualificationResult, setQualificationResult] = useState<LeadQualificationResult | null>(null)
  const supabase = createClient()

  const onSubmit = async (data: FormData) => {
    setApiError('')
    
    try {
      // Calculate lead score and rating
      const answers: QuestionnaireAnswers = {
        current_farming_status: data.current_farming_status,
        start_timeline: data.start_timeline,
        has_land: data.has_land,
        main_challenge: data.main_challenge,
        joining_reason: data.joining_reason,
        investment_status: data.investment_status,
      }

      const qualification = calculateLeadScore(answers)
      setQualificationResult(qualification)

      // Save lead to database
      const { data: lead, error } = await supabase
        .from('leads')
        .insert({
          full_name: data.full_name,
          phone: data.phone,
          email: data.email,
          current_farming_status: data.current_farming_status,
          start_timeline: data.start_timeline,
          has_land: data.has_land,
          main_challenge: data.main_challenge,
          joining_reason: data.joining_reason,
          investment_status: data.investment_status,
          lead_score: qualification.score,
          lead_rating: qualification.rating,
          payment_status: 'not_started',
          access_status: qualification.rating === 'qualified' ? 'awaiting_payment' : 'not_eligible',
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving lead:', error)
        setApiError('Failed to submit registration. Please try again.')
        return
      }

      if (lead) {
        setSuccess(true)
      }
    } catch (error) {
      setApiError('An error occurred. Please try again.')
      console.error('Form submission error:', error)
    }
  }

  if (success && qualificationResult) {
    const isQualified = qualificationResult.rating === 'qualified'
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '0979654602'
    const whatsappMessage = encodeURIComponent(
      `Hello Luchiz Farm Team.%0A%0AI have completed the Masterclass registration questionnaire and would like to make payment.%0A%0AMy name is ${qualificationResult ? encodeURIComponent('') : ''}.`
    )

    return (
      <div className="glass-strong p-8 rounded-2xl text-center space-y-6">
        <div className="text-6xl">{isQualified ? '🎉' : '📧'}</div>
        
        <h3 className="text-2xl font-bold text-foreground">
          {isQualified ? 'Congratulations!' : 'Thank You for Your Interest!'}
        </h3>
        
        {isQualified ? (
          <>
            <p className="text-lg text-foreground/80">
              Based on your responses, you <strong>qualify</strong> for the Luchiz Farm Masterclass.
            </p>
            
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl space-y-4">
              <p className="text-foreground/80">
                To complete your registration, contact our team on WhatsApp to make payment.
              </p>
              
              <div className="space-y-2">
                <p className="font-semibold text-foreground">WhatsApp: {whatsappNumber}</p>
              </div>
              
              <a
                href={`https://wa.me/260${whatsappNumber.replace(/^0/, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <span>💬</span>
                Continue to WhatsApp
              </a>
              
              <p className="text-sm text-foreground/60">
                Click the button above to open WhatsApp and send your payment. Our team will guide you through the next steps.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg text-foreground/80">
              Thank you for your interest in the Luchiz Farm Masterclass.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl space-y-3">
              <p className="text-foreground/80">
                We have saved your details and will keep you updated with:
              </p>
              <ul className="text-left text-sm text-foreground/70 space-y-2">
                <li>✓ Future farming training opportunities</li>
                <li>✓ Free resources and tips</li>
                <li>✓ Special offers for upcoming cohorts</li>
              </ul>
              <p className="text-sm text-foreground/70">
                We'll be in touch soon!
              </p>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Personal Information */}
      <div className="glass-strong p-6 rounded-2xl space-y-4">
        <h3 className="text-xl font-bold text-foreground">👤 Personal Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('full_name', { required: 'Name is required' })}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter your full name"
          />
          {errors.full_name && <span className="text-red-500 text-sm">{errors.full_name.message}</span>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phone', { required: 'Phone number is required' })}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+260..."
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
        </div>
      </div>

      {/* Business Readiness Questionnaire */}
      <div className="glass-strong p-6 rounded-2xl space-y-4">
        <h3 className="text-xl font-bold text-foreground">📋 Business Readiness Questionnaire</h3>
        <p className="text-sm text-foreground/70">
          Answer these questions to help us understand your farming goals and readiness.
        </p>

        {/* Question 1 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            1. Are you currently involved in pig farming? <span className="text-red-500">*</span>
          </label>
          <select
            {...register('current_farming_status', { required: 'Please select an option' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select an option</option>
            <option value="commercially">Yes, commercially</option>
            <option value="small_scale">Yes, small scale</option>
            <option value="not_yet">Not yet</option>
          </select>
          {errors.current_farming_status && <span className="text-red-500 text-sm">{errors.current_farming_status.message}</span>}
        </div>

        {/* Question 2 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            2. When do you plan to start or expand? <span className="text-red-500">*</span>
          </label>
          <select
            {...register('start_timeline', { required: 'Please select an option' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select an option</option>
            <option value="operating">Already operating</option>
            <option value="within_3_months">Within 3 months</option>
            <option value="within_6_months">Within 6 months</option>
            <option value="exploring">Just exploring</option>
          </select>
          {errors.start_timeline && <span className="text-red-500 text-sm">{errors.start_timeline.message}</span>}
        </div>

        {/* Question 3 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            3. Do you currently have land for pig farming? <span className="text-red-500">*</span>
          </label>
          <select
            {...register('has_land', { required: 'Please select an option' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          {errors.has_land && <span className="text-red-500 text-sm">{errors.has_land.message}</span>}
        </div>

        {/* Question 4 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            4. What is your biggest challenge? <span className="text-red-500">*</span>
          </label>
          <select
            {...register('main_challenge', { required: 'Please select an option' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select an option</option>
            <option value="starting">Starting the business</option>
            <option value="feed_costs">Feed costs</option>
            <option value="pig_health">Pig health</option>
            <option value="marketing">Marketing</option>
            <option value="general_knowledge">General knowledge</option>
          </select>
          {errors.main_challenge && <span className="text-red-500 text-sm">{errors.main_challenge.message}</span>}
        </div>

        {/* Question 5 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            5. Why are you joining this masterclass? <span className="text-red-500">*</span>
          </label>
          <select
            {...register('joining_reason', { required: 'Please select an option' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select an option</option>
            <option value="start_commercial">Start a commercial farm</option>
            <option value="expand_farm">Expand an existing farm</option>
            <option value="learn_before_investing">Learn before investing</option>
            <option value="general_interest">General interest</option>
          </select>
          {errors.joining_reason && <span className="text-red-500 text-sm">{errors.joining_reason.message}</span>}
        </div>

        {/* Question 6 */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            6. Have you set aside money for your pig farming project? <span className="text-red-500">*</span>
          </label>
          <select
            {...register('investment_status', { required: 'Please select an option' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="partially">Partially</option>
            <option value="no">No</option>
          </select>
          {errors.investment_status && <span className="text-red-500 text-sm">{errors.investment_status.message}</span>}
        </div>
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {apiError}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gradient-accent text-white py-4 text-lg hover:shadow-2xl transition-all hover:scale-105"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Registration'}
      </Button>

      <p className="text-xs text-foreground/60 text-center">
        By submitting, you confirm that the information provided is accurate.
        {qualificationResult && qualificationResult.rating === 'qualified' && (
          <span className="block mt-2">
            Qualified leads will receive WhatsApp payment instructions.
          </span>
        )}
      </p>
    </form>
  )
}