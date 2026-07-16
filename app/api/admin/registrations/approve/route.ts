import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const registrationId = parseInt(formData.get('registrationId') as string)
    const action = formData.get('action') as string
    const rejectionReason = formData.get('rejectionReason') as string | null

    if (!registrationId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = user.user_metadata?.role === 'admin' || 
                    user.app_metadata?.role === 'admin'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update registration
    const updateData: any = {
      approved_by: user.id,
      updated_at: new Date().toISOString(),
    }

    if (action === 'approve') {
      updateData.status = 'approved'
      updateData.approved_at = new Date().toISOString()
      updateData.rejection_reason = null
    } else if (action === 'reject') {
      updateData.status = 'rejected'
      updateData.rejection_reason = rejectionReason || 'No reason provided'
    }

    const { data: registration, error } = await supabase
      .from('registrations')
      .update(updateData)
      .eq('id', registrationId)
      .select()
      .single()

    if (error) {
      console.error('Error updating registration:', error)
      return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      registration,
      message: action === 'approve' ? 'Registration approved successfully' : 'Registration rejected',
    })
  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 })
  }
}