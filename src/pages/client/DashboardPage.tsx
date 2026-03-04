import { PageHeader } from '@/components/layout/PageHeader'
import { Bell, Shield, Activity, TrendingUp } from 'lucide-react'
import { Badge, ScoreBadge } from '@/components/ui/Badge'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { formatDateTime } from '@/utils/formatters'

const ALERT_TREND = [
  { date: '25/02', alerts: 2 },
  { date: '26/02', alerts: 5 },
  { date: '27/02', alerts: 1 },
  { date: '28/02', alerts: 8 },
  { date: '01/03', alerts: 3 },
  { date: '02/03', alerts: 6 },
]

const MY_ALERTS = [
  { id: '1', title: 'Malicious IP detected in your logs',         severity: 'critical' as const, createdAt: '2026-03-02T08:30:00Z' },
  { id: '2', title: 'Suspicious hash — unsigned executable',      severity: 'high'     as const, createdAt: '2026-03-01T15:00:00Z' },
  { id: '3', title: 'SSH bruteforce login attempts detected',     severity: 'medium'   as const, createdAt: '2026-03-01T09:00:00Z' },
  { id: '4', title: 'C2 domain blocked by your firewall',         severity: 'low'      as const, createdAt: '2026-02-28T18:00:00Z' },
]

function KpiCard({ label, value, icon: Icon, color }: {
  label: string; value: string | number; icon: React.ElementType; color: string
}) {
  return (
    <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--text-muted)]">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}18` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Dashboard"
        subtitle="Overview of your security posture"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Open Alerts"       value={4}        icon={Bell}       color="#FF4444" />
        <KpiCard label="Active IoCs"       value={27}       icon={Shield}     color="#FF8C00" />
        <KpiCard label="Risk Score"        value="68/100"   icon={Activity}   color="#FFD700" />
        <KpiCard label="Recommendations"   value={3}        icon={TrendingUp} color="#00D9FF" />
      </div>

      {/* Chart + alertes */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Tendance alertes */}
        <div className="lg:col-span-2 rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <p className="mb-4 text-sm font-medium text-[var(--text-primary)]">Alerts (last 7 days)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ALERT_TREND}>
              <XAxis dataKey="date" tick={{ fill: '#8B949E', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: 6 }}
                labelStyle={{ color: '#E6EDF3' }}
              />
              <Bar dataKey="alerts" radius={[3, 3, 0, 0]}>
                {ALERT_TREND.map((entry, i) => (
                  <Cell key={i} fill={entry.alerts >= 6 ? '#FF4444' : entry.alerts >= 4 ? '#FF8C00' : '#00D9FF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score risque */}
        <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-5 flex flex-col items-center justify-center gap-3">
          <p className="text-sm font-medium text-[var(--text-primary)]">Global Risk</p>
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-yellow-500/30">
            <span className="text-3xl font-bold text-yellow-400">68</span>
            <span className="absolute bottom-6 text-xs text-[var(--text-muted)]">/100</span>
          </div>
          <Badge variant="high">High</Badge>
        </div>
      </div>

      {/* Mes alertes récentes */}
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
          <p className="text-sm font-medium text-[var(--text-primary)]">Recent Alerts</p>
          <a href="/alerts" className="text-xs text-[var(--accent-cyan)] hover:underline">View all</a>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {MY_ALERTS.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--bg-tertiary)] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-[var(--text-primary)]">{a.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatDateTime(a.createdAt)}</p>
              </div>
              <Badge variant={a.severity}>
                {a.severity === 'critical' ? 'Critical' : a.severity === 'high' ? 'High' : a.severity === 'medium' ? 'Medium' : 'Low'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
