'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface DownloadFile {
  name: string
  url: string
  created_at: string
}

export default function DownloadsPage() {
  const [files, setFiles] = useState<DownloadFile[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      // Get user's registration
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const { data: registration } = await supabase
        .from('registrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .maybeSingle()

      const regData = registration as { id: number } | null

      if (!regData) return

      // For now, we'll show the PDF guide
      // In the future, you can expand this to show multiple files
      setFiles([
        {
          name: 'Pig Farmer\'s Guide',
          url: '', // Will be populated when downloading
          created_at: new Date().toISOString()
        }
      ])
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (fileName: string) => {
    setDownloading(fileName)
    
    try {
      // Get user's registration
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('Please login to download')
        return
      }

      const { data: registration } = await supabase
        .from('registrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .maybeSingle()

      const regData = registration as { id: number } | null

      if (!regData) {
        alert('You must be approved to download this file')
        return
      }

      // Call API to get signed URL
      const response = await fetch('/api/downloads/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileName,
          registrationId: regData.id 
        }),
      })

      const data = await response.json()

      if (data.success && data.url) {
        // Record download
        await supabase.from('pdf_downloads').insert({
          registration_id: regData.id,
          user_id: user.id,
          file_name: fileName,
        } as any)

        // Open download
        window.open(data.url, '_blank')
      } else {
        alert(data.error || 'Failed to generate download link')
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download file')
    } finally {
      setDownloading(null)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-foreground/70">Loading downloads...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Downloads</h1>
        <p className="text-lg text-foreground/70">
          Access your masterclass materials and resources
        </p>
      </div>

      {files.length === 0 ? (
        <div className="glass-strong p-8 rounded-2xl text-center space-y-4">
          <div className="text-6xl">📭</div>
          <h2 className="text-2xl font-bold text-foreground">No Downloads Available</h2>
          <p className="text-foreground/70">
            Check back later for new materials and resources
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {files.map((file) => (
            <div 
              key={file.name}
              className="glass-strong p-6 rounded-2xl space-y-4 hover:scale-105 transition-transform"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="text-4xl">📄</div>
                  <h3 className="text-xl font-bold text-foreground">{file.name}</h3>
                  <p className="text-sm text-foreground/60">
                    Added {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => handleDownload(file.name)}
                disabled={downloading === file.name}
                className="w-full gradient-accent text-white"
              >
                {downloading === file.name ? 'Preparing Download...' : 'Download'}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Download Info */}
      <div className="glass p-6 rounded-xl space-y-2">
        <h3 className="font-bold text-foreground">ℹ️ Download Information</h3>
        <ul className="space-y-1 text-sm text-foreground/70">
          <li>• Downloads are tracked for analytics</li>
          <li>• Links expire after 60 seconds for security</li>
          <li>• You can download files multiple times</li>
          <li>• Contact support if you encounter any issues</li>
        </ul>
      </div>
    </div>
  )
}