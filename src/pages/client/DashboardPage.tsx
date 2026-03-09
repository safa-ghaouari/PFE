import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Bell, Shield, Activity, TrendingUp, Download, FileText, RefreshCw, ArrowRight,
  AlertCircle, Search, CheckCircle, ShieldAlert, Info,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

// ── Mock data ──────────────────────────────────────────────────────────────────
const ALERT_TREND = [
  { date: '25/02', alerts: 2 },
  { date: '26/02', alerts: 5 },
  { date: '27/02', alerts: 1 },
  { date: '28/02', alerts: 8 },
  { date: '01/03', alerts: 3 },
  { date: '02/03', alerts: 6 },
]

// Investigation status counts (derived from all alerts)
const INVESTIGATION_STATS = { open: 4, investigating: 2, resolved: 3, false_positive: 1 }
const TOTAL_ALERTS = Object.values(INVESTIGATION_STATS).reduce((a, b) => a + b, 0)

// Latest reports
const LATEST_REPORTS = [
  { id: 'rp10', title: 'Weekly Threat Report — W09 2026',  periodLabel: '24 Feb–2 Mar 2026', status: 'generating' as const, sizeKb: 0    },
  { id: 'rp4',  title: 'Monthly Threat Report — Feb 2026', periodLabel: 'February 2026',     status: 'ready'      as const, sizeKb: 2140 },
  { id: 'rp1',  title: 'Weekly Threat Report — W08 2026',  periodLabel: '17–23 Feb 2026',    status: 'ready'      as const, sizeKb: 842  },
]

// Recommendations summary
const RECO_STATS = { pending: 3, in_progress: 1, done: 1 }
const CRITICAL_RECOS = [
  { id: 'r1', title: 'Block C2 IP 185.220.101.47 at Firewall',   severity: 'critical' as const, progress: 0,  status: 'pending'     as const },
  { id: 'r2', title: 'Isolate and Re-image Workstation WRK-042', severity: 'critical' as const, progress: 40, status: 'in_progress' as const },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`
}

const STATUS_DATA = [
  {
    id: 'open',
    label: 'Open',
    value: INVESTIGATION_STATS.open,
    color: 'bg-red-500',
    textColor: 'text-red-400',
    icon: AlertCircle,
    description: 'Awaiting initial review',
  },
  {
    id: 'investigating',
    label: 'Investigating',
    value: INVESTIGATION_STATS.investigating,
    color: 'bg-blue-500',
    textColor: 'text-blue-400',
    icon: Search,
    description: 'Actively being handled',
  },
  {
    id: 'resolved',
    label: 'Resolved',
    value: INVESTIGATION_STATS.resolved,
    color: 'bg-emerald-500',
    textColor: 'text-emerald-400',
    icon: CheckCircle,
    description: 'Successfully mitigated',
  },
  {
    id: 'false-positive',
    label: 'False Positive',
    value: INVESTIGATION_STATS.false_positive,
    color: 'bg-slate-500',
    textColor: 'text-slate-400',
    icon: ShieldAlert,
    description: 'Non-malicious activity',
  },
] as const

const STATUS_RECO_VARIANT = {
  pending:     'neutral',
  in_progress: 'info',
  done:        'success',
} as const

const STATUS_REPORT_VARIANT = {
  ready:      'success',
  generating: 'info',
  failed:     'critical',
} as const

// ── Sub-components ─────────────────────────────────────────────────────────────
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

function SectionHeader({ title, linkTo, linkLabel }: { title: string; linkTo: string; linkLabel: string }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
      <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
      <button
        onClick={() => navigate(linkTo)}
        className="flex items-center gap-1 text-xs text-[var(--accent-cyan)] hover:underline"
      >
        {linkLabel}
        <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ClientDashboardPage() {
  const navigate = useNavigate()
  const [hoveredStatusId, setHoveredStatusId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Dashboard"
        subtitle="Overview of your security posture"
      />

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Open Alerts"     value={4}       icon={Bell}       color="#FF4444" />
        <KpiCard label="Active IoCs"     value={27}      icon={Shield}     color="#FF8C00" />
        <KpiCard label="Risk Score"      value="68/100"  icon={Activity}   color="#FFD700" />
        <KpiCard label="Recommendations" value={3}       icon={TrendingUp} color="#00D9FF" />
      </div>

      {/* ── Chart + Risk score ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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

        <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-5 flex flex-col items-center justify-center gap-3">
          <p className="text-sm font-medium text-[var(--text-primary)]">Global Risk</p>
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-yellow-500/30">
            <span className="text-3xl font-bold text-yellow-400">68</span>
            <span className="absolute bottom-6 text-xs text-[var(--text-muted)]">/100</span>
          </div>
          <Badge variant="high">High</Badge>
        </div>
      </div>

      {/* Investigation Status */}
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">Investigation Status</h2>
            <div className="group relative">
              <Info className="h-4 w-4 text-[var(--text-muted)] cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[var(--bg-tertiary)] text-xs text-[var(--text-muted)] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[var(--border)] z-10">
                Current snapshot of all security alerts and their progress.
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/alerts')}
            className="flex items-center gap-1 text-sm font-medium text-[var(--accent-cyan)] hover:text-white transition-colors group"
          >
            View all alerts
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="p-5 space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {STATUS_DATA.map((status) => {
              const Icon = status.icon
              const isActive = status.id === 'false-positive'
              return (
                <div
                  key={status.id}
                  onMouseEnter={() => setHoveredStatusId(status.id)}
                  onMouseLeave={() => setHoveredStatusId(null)}
                  className={`
                    group w-full p-4 rounded-2xl border transition-all duration-300 cursor-default relative overflow-hidden min-h-[165px]
                    ${isActive
                      ? 'bg-slate-800/55 border-slate-600 ring-1 ring-slate-500/70'
                      : 'bg-[#041238] border-[#1c2f57]'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className={`p-2.5 rounded-xl bg-[#05112e] ${status.textColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-4xl font-bold leading-none ${status.textColor}`}>{status.value}</span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-3xl font-semibold text-white leading-none">
                      {status.label}
                    </h3>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                      {status.description}
                    </p>
                  </div>

                  <div className={`absolute left-4 bottom-4 h-1.5 w-10 rounded-full ${status.color} opacity-45`} />
                </div>
              )
            })}
          </div>
        </div>

        <div className="px-5 py-3 bg-[var(--bg-secondary)] border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <p>Last updated: 2 minutes ago</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time monitoring active
            </span>
          </div>
        </div>
      </div>
      {/* ── Latest Reports + Recommendations (side by side on large screens) ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Latest Reports */}
        <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)]">
          <SectionHeader title="Latest Reports" linkTo="/reports" linkLabel="All reports" />
          <div className="divide-y divide-[var(--border)]">
            {LATEST_REPORTS.map(report => (
              <div key={report.id} className="flex items-center gap-3 px-5 py-3">
                <div className="h-8 w-8 rounded bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 flex items-center justify-center shrink-0">
                  {report.status === 'generating'
                    ? <RefreshCw className="h-3.5 w-3.5 text-[var(--accent-cyan)] animate-spin" />
                    : <FileText className="h-3.5 w-3.5 text-[var(--accent-cyan)]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium text-[var(--text-primary)]">{report.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{report.periodLabel}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={STATUS_REPORT_VARIANT[report.status]}>
                    {report.status === 'generating' ? 'Generating…' : 'Ready'}
                  </Badge>
                  {report.status === 'ready' && (
                    <button className="flex items-center gap-1 text-xs text-[var(--accent-cyan)] hover:text-white transition-colors">
                      <Download className="h-3.5 w-3.5" />
                      {formatSize(report.sizeKb)}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis / Recommendations Status */}
        <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)]">
          <SectionHeader title="Analysis & Remediation" linkTo="/recommendations" linkLabel="All recommendations" />
          <div className="p-5 space-y-4">
            {/* Summary counts */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Pending',     count: RECO_STATS.pending,     color: 'text-[var(--text-muted)]' },
                { label: 'In Progress', count: RECO_STATS.in_progress, color: 'text-blue-400'            },
                { label: 'Completed',   count: RECO_STATS.done,        color: 'text-green-400'           },
              ].map(s => (
                <div key={s.label} className="rounded border border-[var(--border)] p-3 text-center">
                  <div className={`text-xl font-bold ${s.color}`}>{s.count}</div>
                  <div className="mt-0.5 text-xs text-[var(--text-muted)]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Critical recommendations */}
            <div className="space-y-2">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Critical Actions</p>
              {CRITICAL_RECOS.map(reco => (
                <div
                  key={reco.id}
                  className="rounded border border-[var(--border)] p-3 hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
                  onClick={() => navigate('/recommendations')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={reco.severity}>Critical</Badge>
                    <Badge variant={STATUS_RECO_VARIANT[reco.status]}>
                      {reco.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-primary)] mb-2 leading-snug">{reco.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--accent-cyan)]"
                        style={{ width: `${reco.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-muted)] shrink-0">{reco.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
