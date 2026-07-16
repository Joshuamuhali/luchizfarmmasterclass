'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type FormData = {
  name: string
  phone: string
  email: string
  location: string
  experience_level: string
  goals: string
  launch_timeline: string
  fee_commitment: string
  budget: string
  attendance_commitment: string
}

const steps = [
  { id: 1, name: 'Personal Info', fields: ['name', 'phone', 'email'] },
  { id: 2, name: 'Experience', fields: ['location', 'experience_level'] },
  { id: 3, name: 'Plans', fields: ['goals', 'launch_timeline'] },
  { id: 4, name: 'Commitment', fields: ['fee_commitment', 'budget', 'attendance_commitment'] },
  { id: 5, name: 'Review', fields: [] },
]

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, watch, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      location: '',
      experience_level: 'Beginner',
      goals: '',
      launch_timeline: '1-3 months',
      fee_commitment: 'A',
      budget: 'ZMW 5k-20k',
      attendance_commitment: 'Yes',
    }
  })

  const formData = watch()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.is_approved) {
          window.location.href = '/success?status=approved'
        } else {
          window.location.href = '/success?status=general'
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentStepData = steps[currentStep - 1]
  const progress = (currentStep / steps.length) * 100

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground">Step {currentStep} of {steps.length}</h3>
          <p className="text-sm font-medium text-primary">{currentStepData.name}</p>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3 backdrop-blur-sm border border-white/20">
          <div
            className="gradient-accent h-3 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
              step.id === currentStep
                ? 'gradient-accent text-white shadow-lg scale-110'
                : step.id < currentStep
                ? 'bg-white/60 text-primary backdrop-blur-sm border border-white/40'
                : 'bg-white/40 text-foreground/50 backdrop-blur-sm border border-white/20'
            }`}
          >
            {step.id}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
                className="mt-2"
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+260966666666"
                {...register('phone', { required: 'Phone is required' })}
                className="mt-2"
              />
              {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email', { required: 'Email is required' })}
                className="mt-2"
              />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="Lusaka"
                {...register('location', { required: 'Location is required' })}
                className="mt-2"
              />
              {errors.location && <p className="text-destructive text-sm mt-1">{errors.location.message}</p>}
            </div>
            <div>
              <Label htmlFor="experience">Experience Level *</Label>
              <select
                {...register('experience_level')}
                className="mt-2 w-full px-4 py-3 glass rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Already farming">Already farming</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="goals">What are your goals? *</Label>
              <Textarea
                id="goals"
                placeholder="Describe your goals for pig farming..."
                {...register('goals', { required: 'Goals are required' })}
                className="mt-2 min-h-32"
              />
              {errors.goals && <p className="text-destructive text-sm mt-1">{errors.goals.message}</p>}
            </div>
            <div>
              <Label htmlFor="timeline">When do you plan to launch? *</Label>
              <select
                {...register('launch_timeline')}
                className="mt-2 w-full px-4 py-3 glass rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="Already launched">Already launched</option>
                <option value="Less than 1 month">Less than 1 month</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <Label>Will you pay the ZMW 400 fee? *</Label>
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted">
                  <input type="radio" value="A" {...register('fee_commitment')} className="w-4 h-4" />
                  <span className="font-medium">Yes, I&apos;m committed to the payment</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted">
                  <input type="radio" value="B" {...register('fee_commitment')} className="w-4 h-4" />
                  <span className="font-medium">No, I&apos;m just inquiring</span>
                </label>
              </div>
            </div>

            <div>
              <Label>What is your available budget? *</Label>
              <select
                {...register('budget')}
                className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="Less than ZMW 5k">Less than ZMW 5k</option>
                <option value="ZMW 5k-20k">ZMW 5k-20k</option>
                <option value="ZMW 20k+">ZMW 20k+</option>
              </select>
            </div>

            <div>
              <Label>Will you attend all 3 days? (Aug 5-7) *</Label>
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted">
                  <input type="radio" value="Yes" {...register('attendance_commitment')} className="w-4 h-4" />
                  <span className="font-medium">Yes, I can attend all 3 days</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted">
                  <input type="radio" value="Maybe" {...register('attendance_commitment')} className="w-4 h-4" />
                  <span className="font-medium">Maybe, not sure about my schedule</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted">
                  <input type="radio" value="Unsure" {...register('attendance_commitment')} className="w-4 h-4" />
                  <span className="font-medium">Unsure</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4 bg-muted p-6 rounded-lg">
            <h3 className="text-lg font-bold text-foreground">Review Your Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{formData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-foreground">{formData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{formData.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium text-foreground">{formData.experience_level}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Launch Timeline</p>
                <p className="font-medium text-foreground">{formData.launch_timeline}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fee Commitment</p>
                <p className="font-medium text-foreground">{formData.fee_commitment === 'A' ? 'Yes, committed' : 'No, inquiring'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium text-foreground">{formData.budget}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-primary hover:bg-primary/90"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
