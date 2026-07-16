import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin
  const { data: userData } = await supabase.auth.getUser()
  const isAdmin = userData.user?.user_metadata?.role === 'admin' || 
                  userData.user?.app_metadata?.role === 'admin'

  if (!isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { fileName } = body

    if (!fileName) {
      return Response.json({ error: 'File name is required' }, { status: 400 })
    }

    // Delete file from storage
    const { error } = await supabase.storage
      .from('masterclass-files')
      .remove([fileName])

    if (error) {
      console.error('Error deleting file:', error)
      return Response.json({ error: 'Failed to delete file' }, { status: 500 })
    }

    revalidatePath('/admin/content')
    revalidatePath('/admin/uploads')

    return Response.json({ success: true, message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}