'use client'

import { useEffect, useState } from 'react'
import { SalesHero } from '@/components/sales-hero'
import { ProblemSolution } from '@/components/sales-problem-solution'
import { WhoShouldAttend } from '@/components/sales-who-should-attend'
import { Testimonials } from '@/components/sales-testimonials'
import { SalesHostBio } from '@/components/sales-host-bio'
import { Footer } from '@/components/footer'

export default function SalesPage() {
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

  const masterclassPrice = process.env.NEXT_PUBLIC_MASTERCLASS_PRICE || '400'

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <SalesHero />

      {/* Problem/Solution */}
      <ProblemSolution />

      {/* Who Should Attend */}
      <WhoShouldAttend />

      {/* Host Bio Section */}
      <SalesHostBio />

      {/* Testimonials */}
      <Testimonials />

      {/* What's Included */}
      <div className="py-20 px-6 bg-gradient-to-b from-white/30 to-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="glass-strong p-12 rounded-2xl space-y-8 border-2 border-primary/20">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Your Registration Includes
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 glass p-4 rounded-xl">
                <span className="text-2xl text-primary">✓</span>
                <span className="text-foreground/90">3 Days Live Zoom Training</span>
              </div>
              <div className="flex items-center gap-4 glass p-4 rounded-xl">
                <span className="text-2xl text-primary">✓</span>
                <span className="text-foreground/90">Lifetime Replay Access</span>
              </div>
              <div className="flex items-center gap-4 glass p-4 rounded-xl">
                <span className="text-2xl text-primary">✓</span>
                <span className="text-foreground/90">Pig Feed Making eBook (15+ pages)</span>
              </div>
              <div className="flex items-center gap-4 glass p-4 rounded-xl">
                <span className="text-2xl text-primary">✓</span>
                <span className="text-foreground/90">Training Notes</span>
              </div>
              <div className="flex items-center gap-4 glass p-4 rounded-xl">
                <span className="text-2xl text-primary">✓</span>
                <span className="text-foreground/90">Certificate</span>
              </div>
              <div className="flex items-center gap-4 glass p-4 rounded-xl">
                <span className="text-2xl text-primary">✓</span>
                <span className="text-foreground/90">2 Weeks WhatsApp Support</span>
              </div>
            </div>

            <a
              href="/register"
              className="block gradient-accent text-white font-bold py-5 px-12 rounded-xl w-full text-lg hover:shadow-2xl transition-all hover:scale-105 text-center"
            >
              Reserve My Seat
            </a>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20 px-6 bg-gradient-to-b from-white/40 to-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Investment
          </h2>

          <div className="glass-strong p-12 rounded-2xl space-y-6 border-2 border-primary/20">
            <div className="space-y-2">
              <div className="flex items-baseline justify-center gap-4">
                <span className="text-6xl font-bold text-primary">ZMW {masterclassPrice}</span>
              </div>
              <p className="text-sm text-foreground/70">
                One-time payment
              </p>
            </div>

            <div className="border-t border-white/30 pt-6">
              <p className="text-sm font-semibold text-foreground mb-4">You Receive:</p>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-primary">✔</span>
                  <span className="text-foreground/90">Training</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">✔</span>
                  <span className="text-foreground/90">eBook</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">✔</span>
                  <span className="text-foreground/90">Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">✔</span>
                  <span className="text-foreground/90">Recordings</span>
                </div>
              </div>
            </div>

            <a
              href="/register"
              className="block gradient-accent text-white font-bold py-5 px-12 rounded-xl w-full text-lg hover:shadow-2xl transition-all hover:scale-105 text-center"
            >
              Reserve My Seat
            </a>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-foreground/60">
              <span>✓ Secure Payment</span>
              <span>•</span>
              <span>✓ Instant Access</span>
              <span>•</span>
              <span>✓ 30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-6 bg-background">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-foreground text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: 'What if I don\'t have farming experience?',
                a: 'This masterclass is designed for beginners. We start from the basics and build up.',
              },
              {
                q: 'How long do I have access to the training?',
                a: 'Lifetime access to all recordings, materials, and updates.',
              },
              {
                q: 'What if I don\'t see results?',
                a: '30-day money-back guarantee. No questions asked.',
              },
              {
                q: 'Is there WhatsApp support?',
                a: 'Yes, 2 weeks of direct access to experts via WhatsApp.',
              },
              {
                q: 'When does the training start?',
                a: 'August 5-7, 2026. Classes run from 19:30-20:30 daily on Zoom.',
              },
            ].map((item, idx) => (
              <div key={idx} className="glass p-6 rounded-xl space-y-2">
                <p className="font-bold text-foreground">{item.q}</p>
                <p className="text-foreground/70">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-6 bg-gradient-to-b from-white/40 to-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to Improve Your Pig Farming Business?
          </h2>
          <p className="text-lg text-foreground/80">
            Join the next Pig Farming Masterclass. August 5–7, 2026.
          </p>

          <div className="glass-strong p-8 rounded-2xl space-y-6 border-2 border-primary/20">
            <div className="text-4xl font-bold text-primary">
              ZMW {masterclassPrice}
            </div>
            <p className="text-sm text-foreground/70">
              One-time payment
            </p>
            <a
              href="/register"
              className="block gradient-accent text-white font-bold py-5 px-12 rounded-xl w-full text-lg hover:shadow-2xl transition-all hover:scale-105 text-center"
            >
              Reserve My Seat
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}