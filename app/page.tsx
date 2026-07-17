import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">Luchiz Farm Masterclass</h1>
          <p className="text-xl text-foreground/70">Welcome to the platform</p>
        </div>

        <div className="glass-strong p-8 rounded-2xl space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Quick Access</h2>
            
            <div className="grid gap-4">
              <Link 
                href="/sales"
                className="block p-6 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
              >
                <div className="text-3xl mb-2">🎓</div>
                <div className="text-lg font-semibold">Sales Page</div>
                <div className="text-sm opacity-90">Register for the masterclass</div>
              </Link>

              <Link 
                href="/admin/login"
                className="block p-6 bg-white/40 text-foreground rounded-xl hover:bg-white/60 transition border-2 border-primary"
              >
                <div className="text-3xl mb-2">🔐</div>
                <div className="text-lg font-semibold">Admin Login</div>
                <div className="text-sm opacity-70">Access admin dashboard</div>
              </Link>
            </div>
          </div>
        </div>

        <p className="text-sm text-foreground/60">
          © 2026 Luchiz Farm. All rights reserved.
        </p>
      </div>
    </div>
  )
}
