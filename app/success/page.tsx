'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SuccessApproved } from '@/components/success-approved'
import { SuccessGeneral } from '@/components/success-general'
import { Footer } from '@/components/footer'

function SuccessContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  return (
    <div className="bg-card rounded-xl shadow-md p-8">
      {status === 'approved' ? (
        <SuccessApproved />
      ) : (
        <SuccessGeneral />
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground">Luchiz Farm</h1>
          <p className="text-primary italic font-medium">Masterclass Registration</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Suspense fallback={<div className="bg-card rounded-xl shadow-md p-8 text-center">Loading...</div>}>
            <SuccessContent />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
