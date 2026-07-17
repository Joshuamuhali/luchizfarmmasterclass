import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface AdminAuthResult {
  isAdmin: boolean
  user: {
    id: string
    email: string
  } | null
  error?: string
}

export async function checkAdminAuth(): Promise<AdminAuthResult> {
  try {
    const supabase = await createClient()
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return {
        isAdmin: false,
        user: null,
        error: 'No active session'
      }
    }

    // Get user data
    const { data: userData } = await supabase.auth.getUser()
    
    if (!userData.user) {
      return {
        isAdmin: false,
        user: null,
        error: 'User not found'
      }
    }

    // Check if user has admin role in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .maybeSingle()

    if (profileError || !profile) {
      return {
        isAdmin: false,
        user: {
          id: userData.user.id,
          email: userData.user.email || ''
        },
        error: 'Profile not found'
      }
    }

    const profileData = profile as { role: string }
    if (profileData.role !== 'admin') {
      return {
        isAdmin: false,
        user: {
          id: userData.user.id,
          email: userData.user.email || ''
        },
        error: 'Unauthorized: Admin access required'
      }
    }

    return {
      isAdmin: true,
      user: {
        id: userData.user.id,
        email: userData.user.email || ''
      }
    }
  } catch (error) {
    return {
      isAdmin: false,
      user: null,
      error: 'Authentication check failed'
    }
  }
}

export async function requireAdminAuth() {
  const authResult = await checkAdminAuth()
  
  if (!authResult.isAdmin) {
    redirect('/admin/login')
  }
  
  return authResult
}