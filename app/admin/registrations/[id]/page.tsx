import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function RegistrationReviewPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: userData } = await supabase.auth.getUser()
  const isAdmin = userData.user?.user_metadata?.role === 'admin' || 
                  userData.user?.app_metadata?.role === 'admin'

  if (!isAdmin) {
    redirect('/portal')
  }

  // Get registration details
  const { data: registration } = await supabase
    .from('registrations')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  const reg = registration as any

  if (!reg) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="glass-strong p-8 rounded-2xl text-center">
          <h1 className="text-2xl font-bold text-foreground">Registration Not Found</h1>
          <p className="text-foreground/70 mt-2">The registration you're looking for doesn't exist.</p>
          <Link href="/admin/registrations" className="text-primary hover:underline mt-4 inline-block">
            ← Back to Registrations
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <Link href="/admin/registrations" className="text-primary hover:underline text-sm">
          ← Back to Registrations
        </Link>
        <h1 className="text-4xl font-bold text-foreground">Registration #{reg.id}</h1>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
          reg.status === 'approved' ? 'bg-green-100 text-green-800' :
          reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {reg.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="glass-strong p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-foreground">👤 Personal Information</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-foreground/70">Full Name</p>
              <p className="font-semibold text-foreground">{reg.full_name}</p>
            </div>
            
            <div>
              <p className="text-sm text-foreground/70">Email</p>
              <p className="font-semibold text-foreground">{reg.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-foreground/70">Phone</p>
              <p className="font-semibold text-foreground">{reg.phone}</p>
            </div>

            {reg.nrc && (
              <div>
                <p className="text-sm text-foreground/70">NRC</p>
                <p className="font-semibold text-foreground">{reg.nrc}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="glass-strong p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-foreground">💳 Payment Information</h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-foreground/70">Payment Method</p>
              <p className="font-semibold text-foreground capitalize">{reg.payment_method.replace('_', ' ')}</p>
            </div>
            
            <div>
              <p className="text-sm text-foreground/70">Transaction Reference</p>
              <p className="font-semibold text-foreground font-mono">{reg.transaction_reference}</p>
            </div>
            
            <div>
              <p className="text-sm text-foreground/70">Amount Paid</p>
              <p className="font-semibold text-foreground text-lg">ZMW {reg.amount}</p>
            </div>

            <div>
              <p className="text-sm text-foreground/70">Registration Date</p>
              <p className="font-semibold text-foreground">{new Date(reg.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Actions */}
      {reg.status === 'pending' && (
        <div className="glass-strong p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-foreground">✅ Review & Approve</h2>
          
          <form action="/api/admin/registrations/approve" method="POST" className="space-y-4">
            <input type="hidden" name="registrationId" value={reg.id} />
            
            <div className="flex gap-4">
              <button
                type="submit"
                name="action"
                value="approve"
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                ✓ Approve Registration
              </button>
              
              <button
                type="submit"
                name="action"
                value="reject"
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                ✗ Reject Registration
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rejection Reason (optional)
              </label>
              <textarea
                name="rejectionReason"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter reason for rejection..."
              />
            </div>
          </form>
        </div>
      )}

      {/* Approval History */}
      {(reg.approved_at || reg.rejection_reason) && (
        <div className="glass p-6 rounded-2xl space-y-3">
          <h3 className="font-bold text-foreground">Review History</h3>
          
          {reg.approved_at && (
            <div>
              <p className="text-sm text-foreground/70">Approved At</p>
              <p className="text-foreground">{new Date(reg.approved_at).toLocaleString()}</p>
            </div>
          )}
          
          {reg.rejection_reason && (
            <div>
              <p className="text-sm text-foreground/70">Rejection Reason</p>
              <p className="text-foreground">{reg.rejection_reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}