import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get user's registration
  const { data: registration } = await supabase
    .from('registrations')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle()

  const regData = registration as any

  if (!regData || regData.status !== 'approved') {
    redirect('/portal/status')
  }

  // Get announcements
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .gte('expiry_date', new Date().toISOString())
    .order('publish_date', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome, {regData.full_name}!
        </h1>
        <p className="text-lg text-foreground/70">
          You're all set for the Pig Farming Masterclass
        </p>
      </div>

      {/* Masterclass Info */}
      <div className="glass-strong p-8 rounded-2xl space-y-6">
        <h2 className="text-2xl font-bold text-foreground">📚 Masterclass Details</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Date</p>
            <p className="font-semibold text-foreground">August 5-7, 2024</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Time</p>
            <p className="font-semibold text-foreground">19:30 - 20:30 (Daily)</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Format</p>
            <p className="font-semibold text-foreground">Live Zoom Sessions</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-foreground/70">Registration ID</p>
            <p className="font-semibold text-foreground">#{regData.id}</p>
          </div>
        </div>

        <div className="border-t border-white/30 pt-6">
          <h3 className="font-bold text-foreground mb-3">What's Included:</h3>
          <ul className="space-y-2 text-foreground/80">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>3 Days of Live Training</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Pig Farmer's Guide (PDF)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>2 Weeks WhatsApp Support</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Lifetime Access to Recordings</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link 
          href="/portal/downloads"
          className="glass-strong p-6 rounded-2xl hover:scale-105 transition-transform space-y-3"
        >
          <div className="text-4xl">📥</div>
          <h3 className="text-xl font-bold text-foreground">Download Materials</h3>
          <p className="text-sm text-foreground/70">
            Access your Pig Farmer's Guide and other resources
          </p>
        </Link>

        <a
          href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-strong p-6 rounded-2xl hover:scale-105 transition-transform space-y-3"
        >
          <div className="text-4xl">💬</div>
          <h3 className="text-xl font-bold text-foreground">Join WhatsApp Group</h3>
          <p className="text-sm text-foreground/70">
            Connect with fellow farmers and get support
          </p>
        </a>

        <div className="glass-strong p-6 rounded-2xl space-y-3">
          <div className="text-4xl">📞</div>
          <h3 className="text-xl font-bold text-foreground">Get Support</h3>
          <p className="text-sm text-foreground/70">
            Need help? Contact our support team
          </p>
        </div>
      </div>

      {/* Announcements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">📢 Announcements</h2>
        
        {announcements && announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement: any) => (
              <div key={announcement.id} className="glass p-6 rounded-xl space-y-2">
                <h3 className="font-bold text-foreground">{announcement.title}</h3>
                <p className="text-foreground/80">{announcement.message}</p>
                <p className="text-xs text-foreground/60">
                  {new Date(announcement.publish_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass p-6 rounded-xl text-center">
            <p className="text-foreground/70">No announcements at this time</p>
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="glass-strong p-6 rounded-2xl border-2 border-green-200">
        <h3 className="font-bold text-foreground mb-2">✅ Payment Verified</h3>
        <p className="text-sm text-foreground/70">
          Transaction Reference: {regData.transaction_reference}
        </p>
        <p className="text-sm text-foreground/70">
          Amount Paid: ZMW {regData.amount}
        </p>
      </div>
    </div>
  )
}