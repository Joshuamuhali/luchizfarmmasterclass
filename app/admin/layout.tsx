import { redirect } from 'next/navigation'
import { requireAdminAuth } from '@/lib/auth/admin-check'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if user is authenticated and has admin role
  await requireAdminAuth()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-white/30 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <div className="flex gap-4 items-center">
            <a href="/admin" className="text-foreground/70 hover:text-foreground">
              Dashboard
            </a>
            <a href="/admin/registrations" className="text-foreground/70 hover:text-foreground">
              Registrations
            </a>
            <a href="/admin/participants" className="text-foreground/70 hover:text-foreground">
              Participants
            </a>
            <a href="/admin/content" className="text-foreground/70 hover:text-foreground">
              Content
            </a>
            <a href="/admin/downloads" className="text-foreground/70 hover:text-foreground">
              Downloads
            </a>
            <a href="/admin/announcements" className="text-foreground/70 hover:text-foreground">
              Announcements
            </a>
            <a href="/admin/settings" className="text-foreground/70 hover:text-foreground">
              Settings
            </a>
            <a href="/admin/audit-logs" className="text-foreground/70 hover:text-foreground">
              Audit Logs
            </a>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-red-600 hover:text-red-700">
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}