import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
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

  // Get statistics
  const { data: registrations } = await supabase
    .from('registrations')
    .select('status')

  const { data: downloads } = await supabase
    .from('pdf_downloads')
    .select('*')

  const regs = registrations as any[] | null
  const dls = downloads as any[] | null

  const stats = {
    total: regs?.length || 0,
    pending: regs?.filter(r => r.status === 'pending').length || 0,
    approved: regs?.filter(r => r.status === 'approved').length || 0,
    rejected: regs?.filter(r => r.status === 'rejected').length || 0,
    downloads: dls?.length || 0,
  }

  // Get recent registrations
  const { data: recentRegistrations } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-lg text-foreground/70">Manage registrations and downloads</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-5 gap-6">
        <div className="glass-strong p-6 rounded-2xl space-y-2">
          <p className="text-sm text-foreground/70">Total Registrations</p>
          <p className="text-4xl font-bold text-primary">{stats.total}</p>
        </div>
        
        <div className="glass-strong p-6 rounded-2xl space-y-2">
          <p className="text-sm text-foreground/70">Pending Review</p>
          <p className="text-4xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        
        <div className="glass-strong p-6 rounded-2xl space-y-2">
          <p className="text-sm text-foreground/70">Approved</p>
          <p className="text-4xl font-bold text-green-600">{stats.approved}</p>
        </div>
        
        <div className="glass-strong p-6 rounded-2xl space-y-2">
          <p className="text-sm text-foreground/70">Rejected</p>
          <p className="text-4xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        
        <div className="glass-strong p-6 rounded-2xl space-y-2">
          <p className="text-sm text-foreground/70">Total Downloads</p>
          <p className="text-4xl font-bold text-primary">{stats.downloads}</p>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Recent Registrations</h2>
          <a href="/admin/registrations" className="text-primary hover:underline">
            View All →
          </a>
        </div>

        {recentRegistrations && recentRegistrations.length > 0 ? (
          <div className="glass-strong rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {recentRegistrations.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-white/20">
                    <td className="px-6 py-4 text-sm text-foreground">#{reg.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{reg.full_name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{reg.email}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass-strong p-8 rounded-2xl text-center">
            <p className="text-foreground/70">No registrations yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <a href="/admin/registrations" className="glass-strong p-6 rounded-2xl hover:scale-105 transition-transform space-y-3">
          <div className="text-4xl">👥</div>
          <h3 className="text-xl font-bold text-foreground">Manage Registrations</h3>
          <p className="text-sm text-foreground/70">Review and approve/reject registrations</p>
        </a>

        <a href="/admin/uploads" className="glass-strong p-6 rounded-2xl hover:scale-105 transition-transform space-y-3">
          <div className="text-4xl">📤</div>
          <h3 className="text-xl font-bold text-foreground">Upload Files</h3>
          <p className="text-sm text-foreground/70">Upload PDF guides and materials</p>
        </a>

        <a href="/admin/participants" className="glass-strong p-6 rounded-2xl hover:scale-105 transition-transform space-y-3">
          <div className="text-4xl">🎓</div>
          <h3 className="text-xl font-bold text-foreground">View Participants</h3>
          <p className="text-sm text-foreground/70">Manage approved students</p>
        </a>
      </div>
    </div>
  )
}