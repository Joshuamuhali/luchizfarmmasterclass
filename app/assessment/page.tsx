'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionnaireForm } from '@/components/questionnaire-form'

export default function AssessmentPage() {
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [priority, setPriority] = useState('')
  const [leadId, setLeadId] = useState(0)

  const handleComplete = (leadScore: number, leadPriority: string, leadId: number) => {
    setScore(leadScore)
    setPriority(leadPriority)
    setLeadId(leadId)

    // Redirect based on priority
    if (leadScore >= 80) {
      router.push(`/qualified?score=${leadScore}&leadId=${leadId}`)
    } else {
      router.push(`/thank-you?score=${leadScore}`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <QuestionnaireForm onComplete={handleComplete} />
    </div>
  )
}