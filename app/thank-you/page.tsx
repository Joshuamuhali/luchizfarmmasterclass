'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ThankYouPage({ searchParams }: { searchParams: { score?: string } }) {
  const router = useRouter()
  const score = parseInt(searchParams.score || '0')

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full">
        <div className="glass-strong p-12 rounded-2xl space-y-8 text-center">
          {/* Thank You Icon */}
          <div className="text-6xl">📧</div>

          {/* Thank You Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Thank You for Your Interest!
            </h1>
            <p className="text-lg text-foreground/80">
              We've received your assessment and will be in touch with resources tailored to your farming journey.
            </p>
          </div>

          {/* Score Display */}
          <div className="glass p-6 rounded-xl space-y-2">
            <p className="text-sm font-semibold text-foreground/70">Your Assessment Score</p>
            <p className="text-5xl font-bold text-primary">{score}/150</p>
            <p className="text-sm text-foreground/70">
              {score >= 50 ? 'Medium Priority - We\'ll follow up with you' : 'Low Priority - Check back for future opportunities'}
            </p>
          </div>

          {/* What Happens Next */}
          <div className="space-y-4 text-left">
            <h3 className="text-xl font-bold text-foreground">What Happens Next:</h3>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>We'll send you free farming resources and tips</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>You'll receive updates about future masterclass cohorts</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Our team may reach out to answer any questions</span>
              </li>
            </ul>
          </div>

          {/* Free Resources */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl space-y-3">
            <p className="text-sm font-semibold text-blue-800">📚 Free Resources Coming Your Way</p>
            <p className="text-sm text-blue-700">
              We'll send you helpful guides on pig farming basics, feed optimization tips, and common mistakes to avoid.
            </p>
          </div>

          {/* Future Opportunities */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Future Opportunities:</h3>
            <p className="text-foreground/80">
              When you're ready to take your farming to the next level, we'll have special offers and early access for you.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/sales')}
              size="lg"
              className="w-full gradient-accent text-white py-4 hover:shadow-2xl transition-all hover:scale-105"
            >
              Back to Masterclass Page
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Return to Home
            </Button>
          </div>

          {/* Contact */}
          <p className="text-sm text-foreground/60">
            Questions? Contact us at support@pigfarmingmasterclass.com
          </p>
        </div>
      </div>
    </div>
  )
}