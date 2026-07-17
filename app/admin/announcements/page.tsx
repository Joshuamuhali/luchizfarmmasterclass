'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  
  const supabase = createClient()

  useEffect(() => {
    checkAdminStatus()
    loadAnnouncements()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/admin/login')
        return
      }

      // Check if user has admin role in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const profileData = profile as { role: string } | null
      if (profileData?.role !== 'admin') {
        router.push('/admin/login')
        return
      }

      setIsAdmin(true)
    } catch (error) {
      console.error('Error checking admin status:', error)
      router.push('/admin/login')
    }
  }

  const loadAnnouncements = async () => {
    try {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('publish_date', { ascending: false })

      if (data) {
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error loading announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        alert('You must be logged in')
        return
      }

      const insertData: any = {
        title: formData.title,
        message: formData.message,
        created_by: user.id,
        is_active: true,
        publish_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      }

      const { error } = await supabase
        .from('announcements')
        .insert(insertData)

      if (error) {
        console.error('Error creating announcement:', error)
        alert('Failed to create announcement')
        return
      }

      alert('Announcement published successfully!')
      setFormData({ title: '', message: '' })
      setShowForm(false)
      loadAnnouncements()
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to create announcement')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting announcement:', error)
        alert('Failed to delete announcement')
        return
      }

      loadAnnouncements()
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete announcement')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-foreground/70">Loading announcements...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Announcements</h1>
            <p className="text-lg text-foreground/70">Send updates to all students</p>
          </div>
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-white"
          >
            {showForm ? 'Cancel' : '+ New Announcement'}
          </Button>
        </div>
      </div>

      {/* Create Announcement Form */}
      {showForm && (
        <div className="glass-strong p-8 rounded-2xl space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Create Announcement</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Masterclass Reminder"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your announcement message..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This announcement will be visible to all approved students in their portal dashboard.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={submitting}
              className="bg-primary text-white"
            >
              {submitting ? 'Publishing...' : 'Publish Announcement'}
            </Button>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Published Announcements</h2>
        
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="glass-strong p-6 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg">{announcement.title}</h3>
                    <p className="text-foreground/80 mt-2">{announcement.message}</p>
                    <div className="flex gap-4 mt-3 text-sm text-foreground/60">
                      <span>Published: {new Date(announcement.publish_date).toLocaleDateString()}</span>
                      <span>Expires: {new Date(announcement.expiry_date).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        announcement.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {announcement.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-semibold ml-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-strong p-8 rounded-2xl text-center">
            <div className="text-6xl mb-4">📢</div>
            <p className="text-foreground/70">No announcements yet</p>
            <p className="text-sm text-foreground/60 mt-2">
              Create your first announcement to communicate with students
            </p>
          </div>
        )}
      </div>
    </div>
  )
}