'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Settings {
  id: number
  masterclass_title: string
  masterclass_date: string
  masterclass_time: string
  whatsapp_link: string
  price: number
  max_seats: number
  airtel_money_number: string
  account_name: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState<any>({
    masterclass_title: '',
    masterclass_date: '',
    masterclass_time: '',
    whatsapp_link: '',
    price: '',
    max_seats: '',
    airtel_money_number: '',
    account_name: ''
  })
  
  const supabase = createClient()

  useEffect(() => {
    checkAdminStatus()
    loadSettings()
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

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('settings')
        .select('*')
        .single()

      if (data) {
        setSettings(data)
        const newFormData = {
          masterclass_title: data.masterclass_title || '',
          masterclass_date: data.masterclass_date || '',
          masterclass_time: data.masterclass_time || '',
          whatsapp_link: data.whatsapp_link || '',
          price: data.price?.toString() || '',
          max_seats: data.max_seats?.toString() || '',
          airtel_money_number: data.airtel_money_number || '',
          account_name: data.account_name || ''
        }
        setFormData(newFormData)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const form = formData as any
      const settingsData: any = {
        masterclass_title: form.masterclass_title,
        masterclass_date: form.masterclass_date,
        masterclass_time: form.masterclass_time,
        whatsapp_link: form.whatsapp_link,
        price: parseFloat(form.price),
        max_seats: parseInt(form.max_seats),
        airtel_money_number: form.airtel_money_number,
        account_name: form.account_name,
        updated_at: new Date().toISOString()
      }
      
      if (settings?.id) {
        settingsData.id = settings.id
      }

      const { error } = await supabase
        .from('settings')
        .upsert(settingsData)

      if (error) {
        console.error('Error saving settings:', error)
        alert('Failed to save settings')
        return
      }

      alert('Settings saved successfully!')
      loadSettings()
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-foreground/70">Checking permissions...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-center text-foreground/70">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-lg text-foreground/70">Manage masterclass configuration and payment settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Masterclass Details */}
        <div className="glass-strong p-8 rounded-2xl space-y-6">
          <h2 className="text-2xl font-bold text-foreground">📚 Masterclass Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Masterclass Title
              </label>
              <input
                type="text"
                value={formData.masterclass_title}
                onChange={(e) => {
                  const updated = { ...formData, masterclass_title: e.target.value }
                  setFormData(updated)
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Pig Farming Masterclass"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date
                </label>
              <input
                type="date"
                value={formData.masterclass_date}
                onChange={(e) => {
                  const updated = { ...formData, masterclass_date: e.target.value }
                  setFormData(updated)
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Time
                </label>
              <input
                type="time"
                value={formData.masterclass_time}
                onChange={(e) => {
                  const updated = { ...formData, masterclass_time: e.target.value }
                  setFormData(updated)
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                WhatsApp Group Link
              </label>
              <input
                type="url"
                value={formData.whatsapp_link}
                onChange={(e) => {
                  const updated = { ...formData, whatsapp_link: e.target.value }
                  setFormData(updated)
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://chat.whatsapp.com/..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price (ZMW)
                </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => {
                  const updated = { ...formData, price: e.target.value }
                  setFormData(updated)
                }}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="400"
              />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Maximum Seats
                </label>
              <input
                type="number"
                value={formData.max_seats}
                onChange={(e) => {
                  const updated = { ...formData, max_seats: e.target.value }
                  setFormData(updated)
                }}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="250"
              />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="glass-strong p-8 rounded-2xl space-y-6">
          <h2 className="text-2xl font-bold text-foreground">💳 Payment Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Airtel Money Number
              </label>
              <input
                type="tel"
                value={formData.airtel_money_number}
                onChange={(e) => {
                  const updated = { ...formData, airtel_money_number: e.target.value }
                  setFormData(updated)
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="097XXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Account Name
              </label>
              <input
                type="text"
                value={formData.account_name}
                onChange={(e) => {
                  const updated = { ...formData, account_name: e.target.value }
                  setFormData(updated)
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Luchiz Farm"
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={saving}
          className="w-full bg-primary text-white py-3 text-lg"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  )
}