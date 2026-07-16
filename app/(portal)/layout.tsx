import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ReactNode } from 'react'

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Check if user is approved
  const { data: registration } = await supabase
    .from('registrations')
    .select('status')
    .eq('user_id', session.user.id)
    .maybeSingle()

  const regData = registration as { status: string } | null

  if (!regData || regData.status === 'pending') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full space-y-6">
          <div className="glass-strong p-8 rounded-2xl text-center space-y-4">
            <div className="text-6xl">⏳</div>
            <h1 className="text-3xl font-bold text-foreground">Pending Approval</h1>
            <p className="text-foreground/70">
              Your registration is being reviewed. We're verifying your Airtel Money payment.
              You'll receive access once approved.
            </p>
            <p className="text-sm text-foreground/60">
              Please check your email for updates.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (regData.status === 'rejected') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full space-y-6">
          <div className="glass-strong p-8 rounded-2xl text-center space-y-4">
            <div className="text-6xl">❌</div>
            <h1 className="text-3xl font-bold text-foreground">Registration Not Approved</h1>
            <p className="text-foreground/70">
              Your registration was not approved. Please contact support for more information.
            </p>
            <p className="text-sm text-foreground/60">
              If you believe this is an error, please reach out to our team.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-white/30 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Pig Farming Masterclass</h1>
          <div className="flex gap-4">
            <a href="/portal" className="text-foreground/70 hover:text-foreground">
              Dashboard
            </a>
            <a href="/portal/downloads" className="text-foreground/70 hover:text-foreground">
              Downloads
            </a>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-red-600 hover:text-red-700">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}