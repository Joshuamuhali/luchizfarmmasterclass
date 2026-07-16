import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminParticipantsPage() {
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

  // Get approved participants with download stats
  const { data: participants } = await supabase
    .from('registrations')
    .select(`
      *,
      pdf_downloads(count)
    `)
    .eq('status', 'approved')
    .order('approved_at', { ascending: false })

  const parts = participants as any[] | null

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Participants</h1>
        <p className="text-lg text-foreground/70">Manage approved students and their access</p>
      </div>

      {/* Participants Table */}
      {parts && parts.length > 0 ? (
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Downloads</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Approved Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {parts.map((participant) => (
                  <tr key={participant.id} className="hover:bg-white/20">
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">
                      {participant.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{participant.email}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{participant.phone}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {participant.pdf_downloads?.[0]?.count || 0} downloads
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {participant.approved_at ? new Date(participant.approved_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link 
                          href={`/admin/registrations/${participant.id}`}
                          className="text-primary hover:underline text-sm font-semibold"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-strong p-8 rounded-2xl text-center">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-foreground/70">No approved participants yet</p>
          <p className="text-sm text-foreground/60 mt-2">
            Approved students will appear here
          </p>
        </div>
      )}
    </div>
  )
}