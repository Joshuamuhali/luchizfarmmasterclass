'use client'

import { useEffect, useState } from 'react'

export function SalesHero() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const masterclassDate = new Date('2026-08-05T19:30:00').getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = masterclassDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="gradient-hero min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-3xl text-center space-y-8">
        {/* Countdown Timer */}
        <div className="glass-strong p-4 rounded-2xl inline-block">
          <p className="text-sm font-semibold text-foreground mb-3">⏰ Masterclass Starts In:</p>
          <div className="flex gap-4 justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{timeLeft.days}</div>
              <div className="text-xs text-foreground/70">Days</div>
            </div>
            <div className="text-2xl text-foreground/50">:</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{timeLeft.hours}</div>
              <div className="text-xs text-foreground/70">Hours</div>
            </div>
            <div className="text-2xl text-foreground/50">:</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{timeLeft.minutes}</div>
              <div className="text-xs text-foreground/70">Minutes</div>
            </div>
            <div className="text-2xl text-foreground/50">:</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{timeLeft.seconds}</div>
              <div className="text-xs text-foreground/70">Seconds</div>
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Master Pig Farming in <span className="text-primary">3 Days</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-medium">
            Learn practical pig farming systems that help you reduce costs, improve production, and increase profitability.
          </p>
        </div>

        {/* Event Details */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-foreground/70">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>August 5–7, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💻</span>
            <span>Live on Zoom</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💰</span>
            <span>ZMW 400</span>
          </div>
        </div>

        {/* What's Included */}
        <div className="glass-strong p-6 rounded-2xl">
          <p className="text-sm font-semibold text-foreground mb-4">What's Included:</p>
          <div className="grid md:grid-cols-2 gap-3 text-left text-sm">
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>3 Days Live Training</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Lifetime Recording Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Pig Feed eBook (15+ pages)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>2 Weeks WhatsApp Support</span>
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="space-y-4 pt-4">
          <a
            href="/register"
            className="block gradient-accent text-white font-bold py-7 px-12 rounded-xl text-lg hover:shadow-2xl transition-all hover:scale-105 text-center"
          >
            Reserve My Seat
          </a>
          <a href="#course-outline" className="text-sm text-foreground/60 hover:text-primary underline">
            View Course Outline →
          </a>
        </div>
      </div>
    </div>
  )
}
