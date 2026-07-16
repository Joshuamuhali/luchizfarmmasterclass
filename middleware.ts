import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes
  const protectedPaths = ['/portal', '/admin']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Public paths (no auth required)
  const publicPaths = ['/login', '/register', '/assessment', '/qualified', '/thank-you', '/verify-email', '/payment']
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from public auth pages
  if (isPublicPath && session) {
    // Check if user is admin (you'll need to implement this check)
    // For now, redirect to portal
    return NextResponse.redirect(new URL('/portal', request.url))
  }

  return NextResponse.next()
}
