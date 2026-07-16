import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDownloadsPage() {
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

  // Get download analytics
  const { data: downloads } = await supabase
    .from('pdf_downloads')
    .select(`
      *,
      registrations(full_name, email)
    `)
    .order('downloaded_at', { ascending: false })
    .limit(50)

  const downloadList = downloads as any[] | null

  // Get file list for summary
  const { data: files } = await supabase.storage
    .from('masterclass-files')
    .list()

  const filesList = files as any[] | null

  // Calculate stats
  const totalDownloads = downloadList?.length || 0
  const uniqueStudents = new Set(downloadList?.map(d => d.user_id)).size

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Download Analytics</h1>
        <p className="text-lg text-foreground/70">Track resource downloads and engagement</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-strong p-6 rounded-2xl space-y-2">
          <p className="text-sm text-foreground/70">Total Downloads</p>
          <p className="text-4xl font-bold text-primary">{totalDownloads}</p>
        </div>
        
        <div className="glass-strong p-6 rounded-2xl space-y-2">
          <p className="text-sm text-foreground/70">Unique Students</p>
          <p className="text-4xl font-bold text-primary">{uniqueStudents}</p>
        </div>
      </div>

      {/* Recent Downloads */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Recent Downloads</h2>
        
        {downloadList && downloadList.length > 0 ? (
          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Student</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">File</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Downloaded At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {downloadList.map((download) => (
                    <tr key={download.id} className="hover:bg-white/20">
                      <td className="px-6 py-4 text-sm text-foreground font-semibold">
                        {download.registrations?.full_name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {download.registrations?.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {download.file_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {new Date(download.downloaded_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass-strong p-8 rounded-2xl text-center">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-foreground/70">No downloads yet</p>
            <p className="text-sm text-foreground/60 mt-2">
              Download activity will appear here once students start accessing materials
            </p>
          </div>
        )}
      </div>

      {/* Available Resources */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Available Resources</h2>
        
        {filesList && filesList.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {filesList.map((file) => (
              <div key={file.name} className="glass p-4 rounded-xl flex items-center gap-4">
                <div className="text-3xl">📄</div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-sm text-foreground/70">
                    {(file.metadata?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-foreground/70">No resources uploaded yet</p>
        )}
      </div>
    </div>
  )
}