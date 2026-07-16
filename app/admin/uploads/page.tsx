'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function AdminUploadsPage() {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // List files in the masterclass-files bucket
      const { data: filesList } = await supabase.storage
        .from('masterclass-files')
        .list()

      if (filesList) {
        setFiles(filesList)
      }
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('You must be logged in to upload files')
        return
      }

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('masterclass-files')
        .upload(file.name, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (error) {
        console.error('Upload error:', error)
        alert('Failed to upload file')
        return
      }

      alert('File uploaded successfully!')
      loadFiles()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const { error } = await supabase.storage
        .from('masterclass-files')
        .remove([fileName])

      if (error) {
        console.error('Delete error:', error)
        alert('Failed to delete file')
        return
      }

      alert('File deleted successfully!')
      loadFiles()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete file')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-foreground/70">Loading files...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Upload Files</h1>
        <p className="text-lg text-foreground/70">Manage PDF guides and downloadable resources</p>
      </div>

      {/* Upload Section */}
      <div className="glass-strong p-8 rounded-2xl space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Upload New File</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select PDF File
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-sm text-foreground
                file:mr-4 file:py-3 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                file:cursor-pointer
                hover:file:bg-primary/90
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {uploading && (
            <p className="text-sm text-foreground/70">Uploading...</p>
          )}

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Uploaded files will be available to approved students in the downloads section.
              Make sure to create the 'masterclass-files' bucket in Supabase Storage first.
            </p>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Current Files</h2>
        
        {files.length > 0 ? (
          <div className="glass-strong rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">File Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Last Modified</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {files.map((file) => (
                  <tr key={file.name} className="hover:bg-white/20">
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">
                      📄 {file.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {(file.metadata?.size / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(file.updated_at || file.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(file.name)}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass-strong p-8 rounded-2xl text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-foreground/70">No files uploaded yet</p>
            <p className="text-sm text-foreground/60 mt-2">
              Upload your first PDF guide to make it available to students
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="glass p-6 rounded-xl space-y-3">
        <h3 className="font-bold text-foreground">ℹ️ Storage Setup Instructions</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-foreground/70">
          <li>Go to your Supabase project dashboard</li>
          <li>Navigate to Storage → Create a new bucket named 'masterclass-files'</li>
          <li>Set the bucket to <strong>Private</strong></li>
          <li>Upload your PDF files using the form above</li>
          <li>Files will be automatically available to approved students</li>
        </ol>
      </div>
    </div>
  )
}