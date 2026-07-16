'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface QuestionnaireData {
  full_name: string
  email: string
  phone: string
  location: string
  farming_situation: string
  pigs_owned: string
  farming_experience: string
  main_goal: string
  starting_timeline: string
  resources: string[]
  challenges: string[]
  investment_readiness: string
  expected_outcome: string
  why_join: string
}

interface QuestionnaireFormProps {
  onComplete: (score: number, priority: string, leadId: number) => void
}

export function QuestionnaireForm({ onComplete }: QuestionnaireFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<QuestionnaireData>()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const supabase = createClient()

  const totalSteps = 4

  const calculateScore = (data: QuestionnaireData): { score: number; priority: string; farmingStage: string; purchaseIntent: string } => {
    let score = 0

    // Question 1: Farming situation (max 30)
    const situationScores: Record<string, number> = {
      'actively_farm': 30,
      'small_scale': 25,
      'start_soon': 20,
      'researching': 10,
      'just_learning': 5,
    }
    score += situationScores[data.farming_situation] || 0

    // Question 2: Pigs owned (max 30)
    const pigsScores: Record<string, number> = {
      '50_plus': 30,
      '21_50': 25,
      '6_20': 20,
      '1_5': 15,
      'none': 5,
    }
    score += pigsScores[data.pigs_owned] || 0

    // Question 3: Experience (max 20)
    const experienceScores: Record<string, number> = {
      '3_plus_years': 20,
      '1_3_years': 15,
      'less_1_year': 10,
      'none': 5,
    }
    score += experienceScores[data.farming_experience] || 0

    // Question 4: Main goal (max 30)
    const goalScores: Record<string, number> = {
      'commercial_business': 30,
      'increase_profits': 25,
      'reduce_costs': 20,
      'learn_before_investing': 10,
      'general_interest': 5,
    }
    score += goalScores[data.main_goal] || 0

    // Question 5: Timeline (max 25)
    const timelineScores: Record<string, number> = {
      'immediate': 25,
      '3_6_months': 15,
      '6_12_months': 10,
      'researching': 5,
    }
    score += timelineScores[data.starting_timeline] || 0

    // Question 6: Resources (max 55)
    const resourceScores: Record<string, number> = {
      'land': 10,
      'housing': 15,
      'water': 10,
      'capital': 20,
    }
    data.resources.forEach(resource => {
      score += resourceScores[resource] || 0
    })

    // Question 7: Challenges (max 50)
    const challengeScores: Record<string, number> = {
      'feed_costs': 10,
      'disease': 10,
      'breeding': 10,
      'marketing': 10,
      'management': 10,
      'dont_know': 5,
    }
    data.challenges.forEach(challenge => {
      score += challengeScores[challenge] || 0
    })

    // Question 8: Investment readiness (max 25)
    const investmentScores: Record<string, number> = {
      'ready': 25,
      'need_more_info': 10,
      'free_only': 0,
    }
    score += investmentScores[data.investment_readiness] || 0

    // Question 9: Expected outcome (max 25)
    const outcomeScores: Record<string, number> = {
      'profitable_business': 25,
      'increase_profits': 20,
      'avoid_mistakes': 15,
      'general_knowledge': 5,
    }
    score += outcomeScores[data.expected_outcome] || 0

    // Question 10: Why join (text analysis, max 20)
    const whyJoinText = data.why_join.toLowerCase()
    const highIntentKeywords = ['start business', 'increase profits', 'reduce costs', 'expand farm', 'commercial', 'make income', 'make money', 'serious']
    const mediumIntentKeywords = ['learn', 'improve', 'understand', 'knowledge']
    
    if (highIntentKeywords.some(keyword => whyJoinText.includes(keyword))) {
      score += 20
    } else if (mediumIntentKeywords.some(keyword => whyJoinText.includes(keyword))) {
      score += 10
    }

    // Determine priority
    let priority = 'low'
    if (score >= 80) {
      priority = 'high'
    } else if (score >= 50) {
      priority = 'medium'
    }

    // Determine farming stage
    let farmingStage = 'researcher'
    if (data.farming_situation === 'actively_farm' || data.farming_situation === 'small_scale') {
      farmingStage = 'existing_farmer'
    } else if (data.farming_situation === 'start_soon') {
      farmingStage = 'starter'
    }

    // Determine purchase intent
    let purchaseIntent = 'low'
    if (data.investment_readiness === 'ready' && score >= 70) {
      purchaseIntent = 'high'
    } else if (data.investment_readiness === 'need_more_info' || score >= 50) {
      purchaseIntent = 'medium'
    }

    return { score, priority, farmingStage, purchaseIntent }
  }

  const onSubmit = async (data: QuestionnaireData) => {
    setError('')

    try {
      const { score, priority, farmingStage, purchaseIntent } = calculateScore(data)

      const status = score >= 80 ? 'qualified' : score >= 50 ? 'follow_up' : 'nurture'
      const recommendedAction = score >= 80 ? 'allow_registration' : score >= 50 ? 'follow_up' : 'nurture'

      // Save lead to database
      const { data: lead, error: dbError } = await supabase
        .from('leads')
        .insert({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          location: data.location,
          questionnaire_answers: data as any,
          lead_score: score,
          lead_priority: priority,
          lead_status: status,
          farming_stage: farmingStage,
          purchase_intent: purchaseIntent,
          recommended_action: recommendedAction,
        } as any)
        .select()
        .single()

      if (dbError) {
        console.error('Error saving lead:', dbError)
        setError('Failed to save your responses. Please try again.')
        return
      }

      const leadId = lead ? (lead as any).id : 0
      onComplete(score, priority, leadId)
    } catch (err) {
      console.error('Submission error:', err)
      setError('An error occurred. Please try again.')
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Pig Farming Success Assessment</h1>
          <p className="text-lg text-foreground/70">
            Help us understand your farming goals so we can provide the best guidance
          </p>
          <p className="text-sm text-foreground/60">Takes approximately 3 minutes</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">Step {step} of {totalSteps}</span>
            <span className="text-sm text-foreground/70">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="glass-strong p-8 rounded-2xl space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Personal Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('full_name', { required: 'Name is required' })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.full_name && <span className="text-red-500 text-sm">{errors.full_name.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  WhatsApp Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location (Town/Province) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('location', { required: 'Location is required' })}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.location && <span className="text-red-500 text-sm">{errors.location.message}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Farming Background */}
          {step === 2 && (
            <div className="glass-strong p-8 rounded-2xl space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Your Farming Background</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What best describes your current farming situation? <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('farming_situation', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an option</option>
                  <option value="actively_farm">I already own pigs and actively farm</option>
                  <option value="small_scale">I have started pig farming but on a small scale</option>
                  <option value="start_soon">I want to start pig farming within the next 3 months</option>
                  <option value="researching">I am researching before starting</option>
                  <option value="just_learning">I am only interested in learning</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  How many pigs do you currently own? <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('pigs_owned', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an option</option>
                  <option value="none">None yet</option>
                  <option value="1_5">1-5 pigs</option>
                  <option value="6_20">6-20 pigs</option>
                  <option value="21_50">21-50 pigs</option>
                  <option value="50_plus">More than 50 pigs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  How long have you been involved in pig farming? <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('farming_experience', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an option</option>
                  <option value="none">I have not started yet</option>
                  <option value="less_1_year">Less than 1 year</option>
                  <option value="1_3_years">1-3 years</option>
                  <option value="3_plus_years">More than 3 years</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Goals & Timeline */}
          {step === 3 && (
            <div className="glass-strong p-8 rounded-2xl space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Your Goals & Timeline</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What is your main goal for joining this masterclass? <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('main_goal', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an option</option>
                  <option value="commercial_business">Build a commercial pig farming business</option>
                  <option value="increase_profits">Increase my current production and profits</option>
                  <option value="reduce_costs">Reduce farming costs and improve systems</option>
                  <option value="learn_before_investing">Learn before investing</option>
                  <option value="general_interest">General interest</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  How soon do you want to start or improve your pig farming operation? <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('starting_timeline', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an option</option>
                  <option value="immediate">Immediately (within 30 days)</option>
                  <option value="3_6_months">Within 3-6 months</option>
                  <option value="6_12_months">Within 6-12 months</option>
                  <option value="researching">Just researching</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  What resources do you currently have? (Select all that apply) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'land', label: 'Land/space available' },
                    { value: 'housing', label: 'Pig housing already available' },
                    { value: 'water', label: 'Access to water' },
                    { value: 'capital', label: 'Capital available for investment' },
                  ].map(resource => (
                    <label key={resource.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={resource.value}
                        {...register('resources')}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{resource.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Challenges & Readiness */}
          {step === 4 && (
            <div className="glass-strong p-8 rounded-2xl space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Challenges & Readiness</h2>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  What is your biggest challenge in pig farming? (Select all that apply) <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'feed_costs', label: 'High feed costs' },
                    { value: 'disease', label: 'Disease prevention' },
                    { value: 'breeding', label: 'Knowing the right breeds' },
                    { value: 'marketing', label: 'Finding customers/markets' },
                    { value: 'management', label: 'Managing farm finances' },
                    { value: 'dont_know', label: "I don't know where to start" },
                  ].map(challenge => (
                    <label key={challenge.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={challenge.value}
                        {...register('challenges')}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-foreground">{challenge.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Are you willing to invest in training and improving your farming skills? <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('investment_readiness', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an option</option>
                  <option value="ready">Yes, I am ready to invest</option>
                  <option value="need_more_info">I need more information first</option>
                  <option value="free_only">I only want free information</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What result do you want from this masterclass? <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('expected_outcome', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select an option</option>
                  <option value="profitable_business">Create a profitable pig farming business</option>
                  <option value="increase_profits">Increase my current profits</option>
                  <option value="avoid_mistakes">Avoid expensive mistakes</option>
                  <option value="general_knowledge">Gain general knowledge</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Why do you want to join the Masterclass? <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('why_join', { required: 'Please tell us why you want to join' })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your goals and what you hope to achieve..."
                />
                {errors.why_join && <span className="text-red-500 text-sm">{errors.why_join.message}</span>}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              variant="outline"
              className="w-full md:w-auto"
            >
              Previous
            </Button>

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                className="w-full md:w-auto gradient-accent text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto gradient-accent text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}