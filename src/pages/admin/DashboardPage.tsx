import { PageHeader } from '@/components/layout/PageHeader'
import { AlertTriangle, Shield, Users, Activity } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { SEVERITY_COLORS } from '@/utils/constants'
import { ScoreBadge } from '@/components/ui/Badge'

/** Données mock — seront remplacées par des appels API */
const RISK_TREND = [
  { date: '25/02', critical: 3, high: 8, medium: 12 },
  { date: '26/02', critical: 5, high: 6, medium: 10 },
  { date: '27/02', critical: 2, high: 9, medium: 14 },
  { date: '28/02', critical: 7, high: 5, medium: 11 },
  { date: '01/03', critical: 4, high: 11, medium: 9 },
  { date: '02/03', critical: 6, high: 8, medium: 13 },
]

const IOC_DISTRIBUTION = [
  { name: 'IP',      value: 42 },
  { name: 'Domain', value: 28 },
  { name: 'Hash',    value: 18 },
  { name: 'URL',     value: 12 },
]

const COLORS = ['#FF4444', '#FF8C00', '#00D9FF', '#8B949E']

const RECENT_THREATS = [
  { id: '1', title: 'Phishing campaign targeting the banking sector', score: 87, source: 'AlienVault OTX' },
  { id: '2', title: 'New Cobalt Strike C2 detected', score: 76, source: 'FeodoTracker' },
  { id: '3', title: 'LockBit 3.0 Ransomware — new IoCs', score: 92, source: 'CISA' },
  { id: '4', title: 'CVE-2024-1234 active exploitation', score: 65, source: 'NVD' },
]

/** Carte KPI */
function KpiCard({
  label, value, icon: Icon, delta, color,
}: {
  label: string; value: string | number; icon: React.ElementType
  delta?: string; color: string
}) {
  return (
    <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--text-muted)]">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          {delta && <p className="mt-1 text-xs text-[var(--text-subtle)]">{delta}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg`} style={{ backgroundColor: `${color}18` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Global Threat Intelligence overview"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Threats"    value={47}     icon={AlertTriangle} delta="+3 today"           color="#FF4444" />
        <KpiCard label="Validated IoCs"    value={312}    icon={Shield}        delta="+18 this week"      color="#00D9FF" />
        <KpiCard label="Monitored Clients" value={12}     icon={Users}         delta="2 critical alerts"  color="#FF8C00" />
        <KpiCard label="Global Score"      value="74/100" icon={Activity}      delta="High"               color="#FFD700" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Trend menaces */}
        <div className="lg:col-span-2 rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <p className="mb-4 text-sm font-medium text-[var(--text-primary)]">Threat trend (7 days)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={RISK_TREND}>
              <defs>
                <linearGradient id="critical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="high" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF8C00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#8B949E', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8B949E', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: 6 }}
                labelStyle={{ color: '#E6EDF3' }}
              />
              <Area type="monotone" dataKey="critical" stroke="#FF4444" fill="url(#critical)" strokeWidth={2} />
              <Area type="monotone" dataKey="high"     stroke="#FF8C00" fill="url(#high)"     strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution IoC */}
        <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <p className="mb-4 text-sm font-medium text-[var(--text-primary)]">IoC Distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={IOC_DISTRIBUTION} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {IOC_DISTRIBUTION.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ color: '#8B949E', fontSize: 11 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Menaces récentes */}
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
          <p className="text-sm font-medium text-[var(--text-primary)]">Recent Threats</p>
          <a href="/admin/threats" className="text-xs text-[var(--accent-cyan)] hover:underline">View all</a>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {RECENT_THREATS.map((t) => (
            <div key={t.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--bg-tertiary)] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-[var(--text-primary)]">{t.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{t.source}</p>
              </div>
              <ScoreBadge score={t.score} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
