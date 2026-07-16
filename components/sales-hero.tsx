'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function SalesHero({ onRegisterClick }: { onRegisterClick: () => void }) {
  const [spotsLeft, setSpotsLeft] = useState(parseInt(process.env.NEXT_PUBLIC_SPOTS_LIMIT || '15'))
  const [daysLeft, setDaysLeft] = useState(5)

  useEffect(() => {
    // Simulate spots being filled
    const interval = setInterval(() => {
      setSpotsLeft((prev) => Math.max(1, prev - 1))
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="gradient-hero min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-3xl text-center space-y-8">
        {/* Urgency Badge */}
        <div className="inline-block">
          <div className="glass px-6 py-2 rounded-full">
            <p className="text-sm font-semibold text-primary">
              🔥 Only {spotsLeft} Spots Remaining
            </p>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Master Pig Farming in <span className="text-primary">3 Days</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-medium">
            Learn the exact systems top farmers use to generate consistent income
          </p>
        </div>

        {/* Sub-headline with benefit */}
        <div className="glass-strong p-8 rounded-2xl space-y-4">
          <p className="text-lg text-foreground/90">
            You're working hard but not making the money you should. The problem? <strong>You don't have a system.</strong>
          </p>
          <p className="text-lg text-foreground/90">
            This masterclass shows you the exact blueprint successful pig farmers use to go from struggling to thriving.
          </p>
        </div>

        {/* Value Stack */}
        <div className="grid md:grid-cols-3 gap-4 py-6">
          <div className="glass p-4 rounded-xl">
            <p className="text-3xl font-bold text-primary">3</p>
            <p className="text-sm text-foreground/70">Days of Training</p>
          </div>
          <div className="glass p-4 rounded-xl">
            <p className="text-3xl font-bold text-primary">∞</p>
            <p className="text-sm text-foreground/70">Lifetime Access</p>
          </div>
          <div className="glass p-4 rounded-xl">
            <p className="text-3xl font-bold text-primary">2w</p>
            <p className="text-sm text-foreground/70">WhatsApp Support</p>
          </div>
        </div>

        {/* Price Section with Scarcity */}
        <div className="space-y-4">
          <div className="glass-strong p-6 rounded-2xl space-y-2 border-2 border-red-400/50">
            <p className="text-sm font-semibold text-red-600">
              ⚠️ Price increases in 48 hours
            </p>
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-5xl font-bold text-primary">ZMW 400</span>
              <span className="text-xl text-foreground/50 line-through">ZMW 800</span>
            </div>
            <p className="text-sm text-foreground/70">
              Early Bird Price - Save ZMW 400
            </p>
            <p className="text-xs text-red-600 font-semibold">
              After price increase: ZMW 800
            </p>
          </div>
        </div>

        {/* Main CTA */}
        <div className="space-y-4 pt-6">
          <Button
            onClick={onRegisterClick}
            size="lg"
            className="w-full md:w-auto text-lg py-7 px-12 gradient-accent text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
          >
            Claim Your Spot Now
          </Button>
          <p className="text-sm text-foreground/60">
            ✓ Instant access • ✓ Money-back guarantee • ✓ No credit card required
          </p>
        </div>

        {/* Social Proof */}
        <div className="glass p-6 rounded-2xl space-y-3">
          <p className="text-sm font-semibold text-foreground">⭐ What Farmers Are Saying:</p>
          <p className="text-foreground/80 italic">
            "This changed my entire farm. I'm making 3x more profit now." - Mary K., Ndola
          </p>
        </div>
      </div>
    </div>
  )
}
