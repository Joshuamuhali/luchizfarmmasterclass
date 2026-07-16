import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      full_name,
      phone,
      email,
      nrc,
      transaction_reference,
      payment_method,
      amount,
    } = body

    if (!full_name || !phone || !email || !transaction_reference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to register' },
        { status: 401 }
      )
    }

    // Check if user already has a registration
    const { data: existingRegistration } = await supabase
      .from('registrations')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You have already submitted a registration' },
        { status: 400 }
      )
    }

    // Create registration
    const { data: registration, error } = await supabase
      .from('registrations')
      .insert({
        user_id: user.id,
        full_name,
        phone,
        email,
        nrc: nrc || null,
        transaction_reference,
        payment_method: payment_method || 'airtel_money',
        amount: amount || 400,
        status: 'pending',
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      registration,
      message: 'Registration submitted successfully. Please wait for approval.',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    )
  }
}