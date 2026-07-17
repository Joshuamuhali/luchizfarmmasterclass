'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user is already logged in as admin
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Check if admin and redirect
        router.push('/admin')
      }
    })
  }, [router, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        // Check if user is admin
        const { data: userData } = await supabase.auth.getUser()
        const userMetadata = userData.user?.user_metadata
        const appMetadata = userData.user?.app_metadata
        const role = userMetadata?.role || appMetadata?.role

        if (role === 'admin') {
          router.push('/admin')
          router.refresh()
        } else {
          // Not an admin, sign out and show error
          await supabase.auth.signOut()
          setError('Access denied. Admin credentials required.')
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Admin Login</h1>
          <p className="text-foreground/70">Luchiz Farm Masterclass Administration</p>
        </div>

        <div className="glass-strong p-8 rounded-2xl space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="admin@luchizfarm.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-accent text-white py-3 rounded-lg font-semibold"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="text-center text-sm text-foreground/70">
            <a href="/" className="text-primary font-semibold hover:underline">
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}