import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: { status?: string }
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

  // Build query
  let query = supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  // Filter by status if provided
  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: registrations } = await query

  const regs = registrations as any[] | null

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Registrations</h1>
        <p className="text-lg text-foreground/70">Review and manage participant registrations</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Link 
          href="/admin/registrations"
          className="px-4 py-2 rounded-lg bg-white/40 hover:bg-white/60 transition"
        >
          All
        </Link>
        <Link 
          href="/admin/registrations?status=pending"
          className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
        >
          Pending
        </Link>
        <Link 
          href="/admin/registrations?status=approved"
          className="px-4 py-2 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition"
        >
          Approved
        </Link>
        <Link 
          href="/admin/registrations?status=rejected"
          className="px-4 py-2 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition"
        >
          Rejected
        </Link>
      </div>

      {/* Registrations Table */}
      {regs && regs.length > 0 ? (
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {regs.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/20">
                    <td className="px-6 py-4 text-sm text-foreground">#{reg.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">{reg.full_name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{reg.phone}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{reg.email}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-mono">{reg.transaction_reference}</td>
                    <td className="px-6 py-4 text-sm text-foreground">ZMW {reg.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                        reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/admin/registrations/${reg.id}`}
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-strong p-8 rounded-2xl text-center">
          <p className="text-foreground/70">No registrations found</p>
        </div>
      )}
    </div>
  )
}