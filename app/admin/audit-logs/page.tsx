import { requireAdminAuth } from '@/lib/auth/admin-check'
import { createClient } from '@/lib/supabase/server'

export default async function AdminAuditLogsPage() {
  // Check if user is authenticated and has admin role
  const authResult = await requireAdminAuth()
  const supabase = await createClient()

  // Get audit logs
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const logs = (auditLogs as any[]) || []

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-lg text-foreground/70">Track all admin actions and changes</p>
      </div>

      {/* Audit Logs Table */}
      {logs && logs.length > 0 ? (
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Admin</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Target</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Details</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/20">
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div>
                        <p className="font-semibold">{log.admin_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div>
                        <p className="font-semibold capitalize">{log.target_type}</p>
                        {log.target_name && (
                          <p className="text-xs text-foreground/60">{log.target_name}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {log.details && Object.keys(log.details).length > 0 ? (
                        <div className="max-w-xs">
                          {Object.entries(log.details).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="font-semibold">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        'No details'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-strong p-8 rounded-2xl text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-foreground/70">No audit logs yet</p>
          <p className="text-sm text-foreground/60 mt-2">
            Admin actions will be recorded here
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="glass p-6 rounded-xl space-y-3">
        <h3 className="font-bold text-foreground">ℹ️ About Audit Logs</h3>
        <p className="text-sm text-foreground/70">
          Audit logs track all administrative actions including:
        </p>
        <ul className="list-disc list-inside text-sm text-foreground/70 space-y-1">
          <li>Registration approvals and rejections</li>
          <li>Content uploads and deletions</li>
          <li>Announcement publications</li>
          <li>Settings changes</li>
          <li>User management actions</li>
        </ul>
      </div>
    </div>
  )
}