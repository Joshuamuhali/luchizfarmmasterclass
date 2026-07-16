'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { RegistrationForm } from '@/components/registration-form'

export default function CompleteRegistrationPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/register')
      return
    }

    // Check if user already has a registration
    const { data: registration } = await supabase
      .from('registrations')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (registration) {
      router.push('/portal')
      return
    }

    setUser(user)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/70">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Complete Your Registration</h1>
          <p className="text-lg text-foreground/70">
            You're almost there! Create your account and submit payment details to secure your spot.
          </p>
        </div>

        <div className="glass-strong p-8 rounded-2xl">
          <RegistrationForm 
            onSuccess={(data) => {
              console.log('Registration successful:', data)
            }}
            userId={user?.id}
          />
        </div>

        <div className="text-center text-sm text-foreground/60">
          <p>Need help? Contact us at support@pigfarmingmasterclass.com</p>
        </div>
      </div>
    </div>
  )
}