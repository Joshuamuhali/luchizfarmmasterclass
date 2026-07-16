'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { CheckCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SuccessApproved() {
  const [isDownloading, setIsDownloading] = useState(false)
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('id')

  const handleJoinWhatsApp = () => {
    const link = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK
    if (link && link !== 'https://chat.whatsapp.com/') {
      window.open(link, '_blank')
    }
  }

  const handleDownloadPDF = async () => {
    if (!registrationId) {
      alert('Registration ID not found')
      return
    }

    setIsDownloading(true)
    try {
      const response = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      })

      if (response.ok) {
        // Create a link to download the guide PDF directly
        const link = document.createElement('a')
        link.href = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pig_Farmers_Guide_by_Clo--6QQAH.pdf'
        link.download = 'Pig_Farmers_Guide.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-12">
      <div className="animate-bounce">
        <CheckCircle className="w-20 h-20 text-primary" />
      </div>

      <div className="space-y-3">
        <h1 className="text-5xl font-bold text-foreground">You&apos;re In!</h1>
        <p className="text-2xl text-primary font-semibold">Your application has been approved</p>
        <p className="text-lg text-foreground/70">
          Get ready to transform your farm and join successful farmers
        </p>
      </div>

      {/* Premium Guide Download */}
      <div className="glass-strong p-8 rounded-2xl max-w-md w-full space-y-4 border-2 border-primary/30">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">🎁 Exclusive Guide</h2>
          <p className="text-sm text-foreground/70">
            Download the complete Pig Farmer&apos;s Guide before the masterclass
          </p>
        </div>
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="w-full gradient-accent text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? 'Downloading...' : 'Download Guide (PDF)'}
        </Button>
      </div>

      {/* Masterclass Details */}
      <div className="glass p-8 rounded-2xl max-w-md w-full text-left space-y-4">
        <h3 className="font-bold text-foreground text-lg">📅 What&apos;s Next</h3>
        <ul className="space-y-3 text-foreground/80">
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <div>
              <p className="font-medium">Dates: August 5-7, 2024</p>
              <p className="text-sm text-foreground/60">Time: 19:30 - 20:30 (Daily)</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <div>
              <p className="font-medium">2 Weeks WhatsApp Support</p>
              <p className="text-sm text-foreground/60">Direct access to experts</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">✓</span>
            <div>
              <p className="font-medium">Lifetime Recordings</p>
              <p className="text-sm text-foreground/60">Watch anytime, anywhere</p>
            </div>
          </li>
        </ul>
      </div>

      {/* WhatsApp CTA */}
      <div className="space-y-4 w-full max-w-md">
        <Button
          onClick={handleJoinWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all hover:scale-105"
        >
          Join WhatsApp Group
        </Button>
        <p className="text-xs text-foreground/60">
          Get exclusive updates and connect with other approved farmers
        </p>
      </div>

      <p className="text-sm text-primary font-medium pt-4">
        🎉 Welcome to the Luchiz Farm community!
      </p>
    </div>
  )
}
