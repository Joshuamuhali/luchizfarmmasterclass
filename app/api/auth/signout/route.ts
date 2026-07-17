import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkAdminAuth } from '@/lib/auth/admin-check'

export async function POST() {
  const supabase = await createClient()
  
  // Check if user is admin to redirect to appropriate login page
  const authResult = await checkAdminAuth()
  const redirectPath = authResult.isAdmin ? '/admin/login' : '/login'
  
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL(redirectPath, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
}
