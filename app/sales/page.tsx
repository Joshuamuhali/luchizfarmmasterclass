'use client'

import { useRef, useEffect, useState } from 'react'
import { SalesHero } from '@/components/sales-hero'
import { ProblemSolution } from '@/components/sales-problem-solution'
import { Testimonials } from '@/components/sales-testimonials'
import { SalesHostBio } from '@/components/sales-host-bio'
import { Footer } from '@/components/footer'

export default function SalesPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const handleRegisterClick = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

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

  const spotsLimit = process.env.NEXT_PUBLIC_SPOTS_LIMIT || '15'
  const farmersCount = process.env.NEXT_PUBLIC_FARMERS_COUNT || '240'
  const masterclassPrice = process.env.NEXT_PUBLIC_MASTERCLASS_PRICE || '400'
  const masterclassPriceOld = process.env.NEXT_PUBLIC_MASTERCLASS_PRICE_OLD || '800'

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <SalesHero onRegisterClick={handleRegisterClick} />

      {/* Problem/Solution */}
      <ProblemSolution />

      {/* Testimonials */}
      <Testimonials />

      {/* Host Bio Section */}
      <SalesHostBio />

      {/* Registration CTA Section */}
      <div className="py-20 px-6 bg-gradient-to-b from-white/30 to-primary/5">
        <div className="max-w-3xl mx-auto">
          <div className="glass-strong p-12 rounded-2xl space-y-6 border-2 border-primary/20">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎯</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to Transform Your Farm?
              </h2>
              <p className="text-lg text-foreground/80">
                Join {farmersCount}+ successful farmers. Limited to {spotsLimit} spots only.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl space-y-2">
                  <p className="text-2xl">📚</p>
                  <p className="font-bold text-foreground">3 Days Live Training</p>
                  <p className="text-xs text-foreground/70">August 5-7, 2026</p>
                </div>
                <div className="glass p-4 rounded-xl space-y-2">
                  <p className="text-2xl">🎁</p>
                  <p className="font-bold text-foreground">Free Pig Farmer's Guide</p>
                  <p className="text-xs text-foreground/70">ZMW 200 value</p>
                </div>
                <div className="glass p-4 rounded-xl space-y-2">
                  <p className="text-2xl">💬</p>
                  <p className="font-bold text-foreground">2 Weeks WhatsApp Support</p>
                  <p className="text-xs text-foreground/70">Direct access to experts</p>
                </div>
                <div className="glass p-4 rounded-xl space-y-2">
                  <p className="text-2xl">🎥</p>
                  <p className="font-bold text-foreground">Lifetime Recordings</p>
                  <p className="text-xs text-foreground/70">Watch anytime, forever</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <p className="text-sm font-semibold text-green-800">
                🛡️ 30-Day Money-Back Guarantee
              </p>
              <p className="text-xs text-green-700 mt-1">
                If you don't see results, we refund you 100%. No questions asked.
              </p>
            </div>

            <a
              href="/assessment"
              className="block gradient-accent text-white font-bold py-5 px-12 rounded-xl w-full text-lg hover:shadow-2xl transition-all hover:scale-105 animate-pulse text-center"
            >
              🎯 Check If You Qualify
            </a>

            <div className="flex flex-wrap justify-center gap-4 text-xs text-foreground/60">
              <span>✓ Secure Payment</span>
              <span>•</span>
              <span>✓ Instant Access</span>
              <span>•</span>
              <span>✓ 30-Day Guarantee</span>
            </div>

            <p className="text-xs text-red-600 font-semibold text-center">
              ⚠️ Only {spotsLimit} spots available. {farmersCount}+ farmers already registered.
            </p>
          </div>
        </div>
      </div>

      {/* Free PDF Download Section */}
      <div className="py-20 px-6 bg-gradient-to-b from-white/30 to-primary/5">
        <div className="max-w-3xl mx-auto">
          <div className="glass-strong p-12 rounded-2xl space-y-6 border-2 border-primary/20">
            <div className="text-center space-y-4">
              <div className="text-6xl">🎁</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Get Your FREE Pig Farmer's Guide
              </h2>
              <p className="text-lg text-foreground/80">
                Download our comprehensive guide worth ZMW 200 - absolutely free when you register
              </p>
              
              {/* Countdown Timer */}
              <div className="glass-strong p-4 rounded-xl">
                <p className="text-sm font-semibold text-foreground mb-3">⏰ Masterclass Starts In:</p>
                <div className="flex gap-3 justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{timeLeft.days}</div>
                    <div className="text-xs text-foreground/70">Days</div>
                  </div>
                  <div className="text-xl text-foreground/50">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{timeLeft.hours}</div>
                    <div className="text-xs text-foreground/70">Hours</div>
                  </div>
                  <div className="text-xl text-foreground/50">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{timeLeft.minutes}</div>
                    <div className="text-xs text-foreground/70">Minutes</div>
                  </div>
                  <div className="text-xl text-foreground/50">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{timeLeft.seconds}</div>
                    <div className="text-xs text-foreground/70">Seconds</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl space-y-2">
                  <p className="text-2xl">📖</p>
                  <p className="font-bold text-foreground">50+ Pages</p>
                  <p className="text-xs text-foreground/70">Complete farming systems</p>
                </div>
                <div className="glass p-4 rounded-xl space-y-2">
                  <p className="text-2xl">💡</p>
                  <p className="font-bold text-foreground">Proven Strategies</p>
                  <p className="text-xs text-foreground/70">Used by top farmers</p>
                </div>
                <div className="glass p-4 rounded-xl space-y-2">
                  <p className="text-2xl">📊</p>
                  <p className="font-bold text-foreground">Step-by-Step Guides</p>
                  <p className="text-xs text-foreground/70">Easy to implement</p>
                </div>
                <div className="glass p-4 rounded-xl space-y-2">
                  <p className="text-2xl">💰</p>
                  <p className="font-bold text-foreground">Cost-Saving Tips</p>
                  <p className="text-xs text-foreground/70">Save thousands monthly</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <p className="text-sm font-semibold text-yellow-800 text-center">
                ⚠️ This free guide is only available to registered participants
              </p>
            </div>

            <a
              href="/assessment"
              className="block gradient-accent text-white font-bold py-4 px-8 rounded-xl w-full hover:shadow-2xl transition-all hover:scale-105 text-center"
            >
              Start Assessment to Download Free Guide →
            </a>

            <p className="text-xs text-foreground/60 text-center">
              Takes 2 minutes to register • Instant access after approval
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA Section with FOMO */}
      <div className="py-20 px-6 bg-gradient-to-b from-white/40 to-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Urgency Banner */}
          <div className="glass-strong p-4 rounded-xl border-2 border-red-400/50 bg-red-50/50">
            <p className="text-lg font-bold text-red-800">
              ⚠️ Registration closes when all {spotsLimit} spots are filled
            </p>
            <p className="text-sm text-red-700 mt-1">
              Don't wait until it's too late
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to Transform Your Farm?
          </h2>

          <div className="glass-strong p-12 rounded-2xl space-y-6 border-2 border-primary/20">
            {/* Price with Scarcity */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-red-600">
                ⏰ Early Bird Price Ends Soon
              </p>
              <div className="flex items-baseline justify-center gap-4">
                <span className="text-6xl font-bold text-primary">ZMW {masterclassPrice}</span>
                <span className="text-2xl text-foreground/50 line-through">ZMW {masterclassPriceOld}</span>
              </div>
              <p className="text-sm text-foreground/70">
                Save ZMW {parseInt(masterclassPriceOld) - parseInt(masterclassPrice)} - Price increases to ZMW {masterclassPriceOld} after early bird ends
              </p>
            </div>

            {/* Value Stack */}
            <div className="grid md:grid-cols-2 gap-4 py-6">
              <div className="glass p-4 rounded-xl space-y-2">
                <p className="text-2xl">📚</p>
                <p className="font-bold text-foreground">3 Days Live Training</p>
                <p className="text-xs text-foreground/70">August 5-7, 2026</p>
              </div>
              <div className="glass p-4 rounded-xl space-y-2">
                <p className="text-2xl">🎁</p>
                <p className="font-bold text-foreground">Free Pig Farmer's Guide</p>
                <p className="text-xs text-foreground/70">ZMW 200 value</p>
              </div>
              <div className="glass p-4 rounded-xl space-y-2">
                <p className="text-2xl">💬</p>
                <p className="font-bold text-foreground">2 Weeks WhatsApp Support</p>
                <p className="text-xs text-foreground/70">Direct access to experts</p>
              </div>
              <div className="glass p-4 rounded-xl space-y-2">
                <p className="text-2xl">🎥</p>
                <p className="font-bold text-foreground">Lifetime Recordings</p>
                <p className="text-xs text-foreground/70">Watch anytime, forever</p>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <p className="text-sm font-semibold text-green-800">
                🛡️ 30-Day Money-Back Guarantee
              </p>
              <p className="text-xs text-green-700 mt-1">
                If you don't see results, we refund you 100%. No questions asked.
              </p>
            </div>

            {/* Main CTA */}
            <a
              href="/assessment"
              className="block gradient-accent text-white font-bold py-5 px-12 rounded-xl w-full text-lg hover:shadow-2xl transition-all hover:scale-105 animate-pulse text-center"
            >
              🎯 Check If You Qualify - ZMW {masterclassPrice}
            </a>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 text-xs text-foreground/60">
              <span>✓ Secure Payment</span>
              <span>•</span>
              <span>✓ Instant Access</span>
              <span>•</span>
              <span>✓ 30-Day Guarantee</span>
            </div>

            {/* Final Scarcity Message */}
            <p className="text-xs text-red-600 font-semibold">
              ⚠️ Only {spotsLimit} spots available. {farmersCount}+ farmers already registered.
            </p>
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
                a: 'Perfect! This masterclass is designed for beginners. We start from the basics and build up. Many of our top students had zero experience before starting.',
              },
              {
                q: 'How long do I have access to the training?',
                a: 'Lifetime! Once you register, you get permanent access to all recordings, materials, and updates. You can watch at your own pace, anytime.',
              },
              {
                q: 'What if I don\'t see results?',
                a: 'We offer a 30-day money-back guarantee. No questions asked. If you don\'t love the training, we refund you completely.',
              },
              {
                q: 'Is there WhatsApp support?',
                a: 'Yes! For 2 weeks after the masterclass ends, you get direct access to our experts via WhatsApp to answer your specific questions.',
              },
              {
                q: 'When does the training start?',
                a: 'August 5-7, 2026. Classes run from 19:30-20:30 daily on Zoom. Recordings available immediately after if you can\'t make live sessions.',
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

      {/* Footer */}
      <Footer />
    </div>
  )
}