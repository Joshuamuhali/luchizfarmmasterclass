import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PortalStatusPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get user's registration
  const { data: registration } = await supabase
    .from('registrations')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle()

  const reg = registration as any

  if (!reg) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full space-y-6">
          <div className="glass-strong p-8 rounded-2xl text-center space-y-4">
            <div className="text-6xl">📝</div>
            <h1 className="text-3xl font-bold text-foreground">No Registration Found</h1>
            <p className="text-foreground/70">
              You haven't submitted a registration yet.
            </p>
            <a 
              href="/sales" 
              className="inline-block gradient-accent text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (reg.status === 'pending') {
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
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-left space-y-2">
              <p className="text-sm font-semibold text-blue-900">Registration Details:</p>
              <p className="text-sm text-blue-800">Transaction: {reg.transaction_reference}</p>
              <p className="text-sm text-blue-800">Amount: ZMW {reg.amount}</p>
              <p className="text-sm text-blue-800">Submitted: {new Date(reg.created_at).toLocaleDateString()}</p>
            </div>

            <p className="text-sm text-foreground/60">
              Please check your email for updates. This usually takes 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (reg.status === 'rejected') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full space-y-6">
          <div className="glass-strong p-8 rounded-2xl text-center space-y-4">
            <div className="text-6xl">❌</div>
            <h1 className="text-3xl font-bold text-foreground">Registration Not Approved</h1>
            <p className="text-foreground/70">
              Your registration was not approved.
            </p>
            
            {reg.rejection_reason && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-left">
                <p className="text-sm font-semibold text-red-900">Reason:</p>
                <p className="text-sm text-red-800">{reg.rejection_reason}</p>
              </div>
            )}

            <p className="text-sm text-foreground/60">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If approved, redirect to dashboard
  redirect('/portal')
}