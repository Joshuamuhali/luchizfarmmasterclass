import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { fileName, registrationId } = await request.json()

    if (!fileName || !registrationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user session
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify registration exists and is approved
    const { data: registration } = await supabase
      .from('registrations')
      .select('id, status')
      .eq('id', registrationId)
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .maybeSingle()

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found or not approved' }, { status: 403 })
    }

    // Generate signed URL from Supabase Storage
    // Note: You need to create the 'masterclass-files' bucket in Supabase Storage
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('masterclass-files')
      .createSignedUrl(fileName, 60) // URL expires in 60 seconds

    if (urlError || !signedUrl) {
      console.error('Error generating signed URL:', urlError)
      return NextResponse.json({ error: 'Failed to generate download link' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: signedUrl,
    })
  } catch (error) {
    console.error('Download generation error:', error)
    return NextResponse.json({ error: 'Failed to generate download' }, { status: 500 })
  }
}