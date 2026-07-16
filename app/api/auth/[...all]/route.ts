import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET() {
  return Response.json({ error: 'Not found' }, { status: 404 })
}

export async function POST() {
  return Response.json({ error: 'Not found' }, { status: 404 })
}