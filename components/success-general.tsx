'use client'

import { Heart } from 'lucide-react'

export function SuccessGeneral() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
      <Heart className="w-16 h-16 text-blue-500" />
      
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          Thank You!
        </h1>
        <p className="text-xl text-gray-600">
          Your submission has been received
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md">
        <p className="text-gray-700">
          We appreciate your interest in the Luchiz Farm Pig Farming Masterclass. We&apos;ll review your information and get back to you soon with more details about how we can support your farming journey.
        </p>
      </div>

      <p className="text-sm text-gray-500 max-w-md">
        If you have any questions in the meantime, feel free to reach out to us directly.
      </p>
    </div>
  )
}
