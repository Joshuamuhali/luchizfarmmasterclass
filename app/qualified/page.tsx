'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const whatsappGroupLink = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/JhsoN7X7xSJ8w7d3YZ3f8X?s=cl&p=i&ilr=1'

export default function QualifiedPage({ searchParams }: { searchParams: { score?: string; leadId?: string } }) {
  const router = useRouter()
  const score = parseInt(searchParams.score || '0')
  const leadId = searchParams.leadId || '0'

  useEffect(() => {
    // Store leadId in sessionStorage for registration flow
    if (leadId) {
      sessionStorage.setItem('leadId', leadId)
    }
  }, [leadId])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full">
        <div className="glass-strong p-12 rounded-2xl space-y-8 text-center">
          {/* Success Icon */}
          <div className="text-6xl">🎉</div>

          {/* Congratulations */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Congratulations! You Qualify!
            </h1>
            <p className="text-lg text-foreground/80">
              Based on your assessment, you're an excellent fit for the Master Pig Farming Masterclass.
            </p>
          </div>

          {/* Score Display */}
          <div className="glass p-6 rounded-xl space-y-2">
            <p className="text-sm font-semibold text-foreground/70">Your Qualification Score</p>
            <p className="text-5xl font-bold text-primary">{score}/150</p>
            <p className="text-sm text-green-600 font-semibold">High Priority Lead</p>
          </div>

          {/* What You'll Learn */}
          <div className="space-y-4 text-left">
            <h3 className="text-xl font-bold text-foreground">What You'll Master:</h3>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Feed optimization to cut costs by 40%</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Breeding strategies for maximum growth</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Disease prevention that saves lives</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Marketing to command premium prices</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Financial tracking & scaling strategies</span>
              </li>
            </ul>
          </div>

          {/* Investment */}
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl space-y-2">
            <p className="text-sm font-semibold text-green-800">Investment</p>
            <p className="text-4xl font-bold text-primary">ZMW 400</p>
            <p className="text-sm text-green-700">Early Bird Price (Save ZMW 400)</p>
          </div>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Next Steps:</h3>
            <ol className="text-left space-y-3 text-foreground/80">
              <li className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <span>Create your account</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <span>Verify your email address</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <span>Submit payment via Airtel Money</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <span>Get approved and access the portal</span>
              </li>
            </ol>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => router.push('/register')}
            size="lg"
            className="w-full gradient-accent text-white py-6 text-lg hover:shadow-2xl transition-all hover:scale-105"
          >
            Create Account & Reserve Your Spot
          </Button>

          {/* WhatsApp Group Button */}
          <Button
            onClick={() => window.open(whatsappGroupLink, '_blank')}
            size="lg"
            variant="outline"
            className="w-full py-6 text-lg hover:shadow-2xl transition-all hover:scale-105 border-green-500 text-green-700 hover:bg-green-50"
          >
            📱 Join Our WhatsApp Group
          </Button>

          {/* Guarantee */}
          <p className="text-sm text-foreground/60">
            🛡️ 30-Day Money-Back Guarantee • No questions asked
          </p>
        </div>
      </div>
    </div>
  )
}