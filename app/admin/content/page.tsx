import { requireAdminAuth } from '@/lib/auth/admin-check'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminContentPage() {
  // Check if user is authenticated and has admin role
  const authResult = await requireAdminAuth()
  const supabase = await createClient()

  // Get files from storage
  const { data: files } = await supabase.storage
    .from('masterclass-files')
    .list()

  // Get download stats for each file
  const filesList = files as any[] | null

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Masterclass Content</h1>
        <p className="text-lg text-foreground/70">Manage learning resources and materials</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Link 
          href="/admin/uploads"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          <span>+</span>
          Upload New Material
        </Link>
      </div>

      {/* Content List */}
      {filesList && filesList.length > 0 ? (
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">File Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Last Modified</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filesList.map((file) => (
                  <tr key={file.name} className="hover:bg-white/20">
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">
                      📄 {file.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {file.name.endsWith('.pdf') ? 'PDF' : 
                       file.name.endsWith('.mp4') ? 'Video' : 
                       file.name.endsWith('.jpg') || file.name.endsWith('.png') ? 'Image' : 'File'}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {(file.metadata?.size / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(file.updated_at || file.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link 
                          href="/admin/uploads"
                          className="text-primary hover:underline text-sm font-semibold"
                        >
                          Replace
                        </Link>
                        <form action={`/api/admin/content/delete`} method="POST">
                          <input type="hidden" name="fileName" value={file.name} />
                          <button 
                            type="submit"
                            className="text-red-600 hover:text-red-700 text-sm font-semibold"
                            onClick={(e) => {
                              if (!confirm('Are you sure you want to delete this file?')) {
                                e.preventDefault()
                              }
                            }}
                          >
                            Delete
                          </button>
                        </form>
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
          <div className="text-6xl mb-4">📚</div>
          <p className="text-foreground/70">No content uploaded yet</p>
          <p className="text-sm text-foreground/60 mt-2">
            Upload PDFs, videos, and other learning materials
          </p>
          <Link 
            href="/admin/uploads"
            className="inline-block mt-4 text-primary hover:underline font-semibold"
          >
            Upload Your First File →
          </Link>
        </div>
      )}

      {/* Supported Formats */}
      <div className="glass p-6 rounded-xl space-y-3">
        <h3 className="font-bold text-foreground">ℹ️ Supported Content Types</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-foreground/70">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">📄 PDFs</p>
            <p>Ebooks, guides, worksheets</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">🎥 Videos</p>
            <p>MP4 recordings, tutorials</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">🖼️ Images</p>
            <p>Diagrams, infographics</p>
          </div>
        </div>
      </div>
    </div>
  )
}