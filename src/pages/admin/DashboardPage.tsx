import { Link } from 'react-router-dom'
import {
  AlertTriangle, Shield, Users, Activity,
  CheckCircle2, Loader2, ChevronRight,
  Brain, Cpu, Database, GitMerge, FileOutput,
  Zap, Settings2, TrendingUp,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { ScoreBadge } from '@/components/ui/Badge'

// ── Palette ────────────────────────────────────────────────────────────────────
const C = {
  cyan:    '#00D9FF',
  rose:    '#f43f5e',
  orange:  '#fb923c',
  amber:   '#fbbf24',
  emerald: '#34d399',
  indigo:  '#818cf8',
  muted:   '#8B949E',
}

const TT = {
  contentStyle: { backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: 6, fontSize: 12 },
  labelStyle:   { color: '#E6EDF3' },
}

// ── Mock data ──────────────────────────────────────────────────────────────────
const RISK_TREND = [
  { date: '26/02', critical: 3, high: 6, medium: 8 },
  { date: '27/02', critical: 4, high: 5, medium: 7 },
  { date: '28/02', critical: 2, high: 7, medium: 9 },
  { date: '01/03', critical: 5, high: 4, medium: 8 },
  { date: '02/03', critical: 3, high: 8, medium: 7 },
  { date: '03/03', critical: 4, high: 6, medium: 9 },
  { date: '04/03', critical: 2, high: 5, medium: 7 },
]

const IOC_DISTRIBUTION = [
  { name: 'IP',     value: 42, color: C.rose    },
  { name: 'Domain', value: 28, color: C.orange  },
  { name: 'Hash',   value: 18, color: C.cyan    },
  { name: 'URL',    value: 12, color: C.muted   },
]

const RECENT_THREATS = [
  { id: '1', title: 'Phishing campaign targeting the banking sector', score: 87, source: 'AlienVault OTX' },
  { id: '2', title: 'New Cobalt Strike C2 detected',                  score: 76, source: 'FeodoTracker'   },
  { id: '3', title: 'LockBit 3.0 Ransomware — new IoCs',             score: 92, source: 'CISA'           },
  { id: '4', title: 'CVE-2024-1234 active exploitation',              score: 65, source: 'NVD'            },
]

// 7-step pipeline
type StepStatus = 'done' | 'active' | 'pending'
const PIPELINE: { step: number; label: string; icon: React.ElementType; status: StepStatus; detail: string }[] = [
  { step: 0, label: 'Initial Config',    icon: Settings2,  status: 'done',    detail: 'Sources & parameters loaded'       },
  { step: 1, label: 'Data Collection',  icon: Database,   status: 'done',    detail: '14 CTI feeds ingested'              },
  { step: 2, label: 'NLP Extraction',   icon: Brain,      status: 'active',  detail: 'Extracting IoCs from raw reports…'  },
  { step: 3, label: 'IoC Validation',   icon: Shield,     status: 'pending', detail: 'Confidence scoring queued'          },
  { step: 4, label: 'Int. Correlation', icon: GitMerge,   status: 'pending', detail: 'SIEM / EDR matching queued'         },
  { step: 5, label: 'Alert Generation', icon: Zap,        status: 'pending', detail: 'Awaiting correlation results'       },
  { step: 6, label: 'AI Summary',       icon: Cpu,        status: 'pending', detail: 'Decision support pending'           },
  { step: 7, label: 'Reporting',        icon: FileOutput, status: 'pending', detail: 'Report generation pending'          },
]

// NLP extraction feed
const NLP_FEED = [
  { ioc: '185.220.101.47',             type: 'IP',     conf: 97, source: 'CISA Advisory AA24-038A',   status: 'validated' as const  },
  { ioc: 'c2-lazarus-node12.xyz',      type: 'Domain', conf: 91, source: 'FeodoTracker dump 03/03',  status: 'validated' as const  },
  { ioc: 'CVE-2024-3400',              type: 'CVE',    conf: 99, source: 'NVD feed 03/03',            status: 'validated' as const  },
  { ioc: 'a3f4d7...8c1e (SHA-256)',    type: 'Hash',   conf: 84, source: 'AlienVault OTX pulse',     status: 'reviewing' as const  },
  { ioc: 'hxxps://login-office365[.]ru',type: 'URL',   conf: 78, source: 'OpenPhish stream',         status: 'reviewing' as const  },
  { ioc: '91.234.99.110',              type: 'IP',     conf: 62, source: 'Emerging Threats rules',   status: 'uncertain' as const  },
]

// Correlation matrix
const CORR_MATRIX = [
  {
    client:   'BankCorp SA',
    threat:   'LockBit 3.0 C2',
    extSource:'CISA / FeodoTracker',
    intSource:'Splunk SIEM',
    asset:    'SRV-CORE-01',
    severity: 'critical' as const,
    score:    94,
  },
  {
    client:   'BankCorp SA',
    threat:   '185.220.101.47 (C2 IP)',
    extSource:'AlienVault OTX',
    intSource:'CrowdStrike EDR',
    asset:    'WRK-FIN-042',
    severity: 'critical' as const,
    score:    91,
  },
  {
    client:   'TeleCom Group',
    threat:   'CVE-2024-3400 (PAN-OS)',
    extSource:'NVD / CISA',
    intSource:'QRadar SIEM',
    asset:    'FW-EDGE-PAN',
    severity: 'high' as const,
    score:    78,
  },
  {
    client:   'HealthNet',
    threat:   'Emotet dropper hash',
    extSource:'AlienVault OTX',
    intSource:'SentinelOne EDR',
    asset:    'WS-HR-007',
    severity: 'high' as const,
    score:    72,
  },
  {
    client:   'RetailChain',
    threat:   'login-office365[.]ru phishing URL',
    extSource:'OpenPhish',
    intSource:'Microsoft Defender',
    asset:    'MAIL-GW-01',
    severity: 'medium' as const,
    score:    55,
  },
]

// AI recommendations
const AI_RECOS = [
  { priority: 'P1', text: 'Immediately block 185.220.101.47 on all perimeter firewalls for BankCorp SA and TeleCom Group.', color: C.rose    },
  { priority: 'P1', text: 'Patch PAN-OS on FW-EDGE-PAN (TeleCom) — CVE-2024-3400 RCE is actively exploited in the wild.', color: C.rose    },
  { priority: 'P2', text: 'Isolate WRK-FIN-042 from the network and initiate forensic memory acquisition.',                  color: C.orange  },
  { priority: 'P2', text: 'Deploy updated Emotet IOC signatures to SentinelOne EDR across all HealthNet endpoints.',         color: C.orange  },
  { priority: 'P3', text: 'Schedule phishing simulation for RetailChain mail gateway — user awareness training needed.',     color: C.amber   },
]

// ── Sub-components ─────────────────────────────────────────────────────────────
function KpiCard({ label, value, icon: Icon, delta, color }: {
  label: string; value: string | number; icon: React.ElementType; delta?: string; color: string
}) {
  return (
    <div className={CARD_PADDED}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-muted)]">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          {delta && <p className="mt-1.5 text-sm text-[var(--text-muted)]">{delta}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}18` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

const SEV_COLOR: Record<string, string> = {
  critical: C.rose, high: C.orange, medium: C.amber, low: C.emerald,
}

function SevBadge({ sev }: { sev: string }) {
  const color = SEV_COLOR[sev] ?? C.muted
  return (
    <span
      className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
    >
      {sev}
    </span>
  )
}

function ConfBar({ value }: { value: number }) {
  const color = value >= 90 ? C.emerald : value >= 75 ? C.cyan : value >= 60 ? C.amber : C.orange
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="w-7 text-right text-[11px] font-bold tabular-nums" style={{ color }}>{value}%</span>
    </div>
  )
}

const STATUS_DOT: Record<string, string> = {
  validated: C.emerald, reviewing: C.amber, uncertain: C.orange,
}

const CARD_BASE = 'rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]'
const CARD_PADDED = `${CARD_BASE} p-6`

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const activeStep = PIPELINE.find(s => s.status === 'active')?.step ?? 0
  const doneCount  = PIPELINE.filter(s => s.status === 'done').length

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-1">

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Threats"    value={47}     icon={AlertTriangle} delta="+3 today"          color={C.rose}   />
        <KpiCard label="Validated IoCs"    value={312}    icon={Shield}        delta="+18 this week"     color={C.cyan}   />
        <KpiCard label="Monitored Clients" value={12}     icon={Users}         delta="2 critical alerts" color={C.orange} />
        <KpiCard label="Global Score"      value="74/100" icon={Activity}      delta="High risk"         color={C.amber}  />
      </div>

      {/* ── Live Job Pipeline ── */}
      <div className={CARD_PADDED}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Live Job Pipeline</p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Step {activeStep}/7 running — {doneCount} completed
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: C.emerald }} /> Done
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: C.cyan }} /> Active
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-white/20" /> Pending
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-start gap-0 overflow-x-auto pb-2">
          {PIPELINE.map((s, idx) => {
            const Icon = s.icon
            const isDone   = s.status === 'done'
            const isActive = s.status === 'active'
            const color     = isDone ? C.emerald : isActive ? C.cyan : '#374151'
            const textColor = isDone ? C.emerald : isActive ? C.cyan : C.muted

            return (
              <div key={s.step} className="flex min-w-0 flex-1 flex-col items-center">
                {/* Connector line row */}
                <div className="flex w-full items-center">
                  {/* Left line */}
                  <div
                    className="h-px flex-1 transition-colors"
                    style={{ background: idx === 0 ? 'transparent' : isDone || isActive ? C.emerald : '#374151' }}
                  />
                  {/* Circle */}
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                    style={{
                      borderColor: color,
                      background:  isDone ? `${C.emerald}18` : isActive ? `${C.cyan}15` : 'transparent',
                      boxShadow:   isActive ? `0 0 12px ${C.cyan}50` : 'none',
                    }}
                  >
                    {isDone
                      ? <CheckCircle2 className="h-4 w-4" style={{ color: C.emerald }} />
                      : isActive
                        ? <Loader2 className="h-4 w-4 animate-spin" style={{ color: C.cyan }} />
                        : <Icon className="h-4 w-4" style={{ color: '#374151' }} />
                    }
                  </div>
                  {/* Right line */}
                  <div
                    className="h-px flex-1 transition-colors"
                    style={{ background: idx === PIPELINE.length - 1 ? 'transparent' : isDone ? C.emerald : '#374151' }}
                  />
                </div>
                {/* Label */}
                <p className="mt-3 text-center text-xs font-semibold leading-tight" style={{ color: textColor }}>
                  {s.label}
                </p>
                <p className="mt-1 hidden px-1 text-center text-[10px] leading-tight text-[var(--text-muted)] xl:block">
                  {s.detail}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Threat Trend + NLP Feed ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">

        {/* Threat Trend */}
        <div className={`lg:col-span-3 ${CARD_PADDED}`}>
          <div className="mb-4">
            <p className="text-base font-semibold text-[var(--text-primary)]">Threat Trend</p>
            <p className="text-xs text-[var(--text-muted)]">Last 7 days — grouped by severity</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={RISK_TREND} margin={{ top: 10, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.rose}   stopOpacity={0.5} />
                  <stop offset="100%" stopColor={C.rose}   stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="gh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.orange} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={C.orange} stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.amber}  stopOpacity={0.45} />
                  <stop offset="100%" stopColor={C.amber}  stopOpacity={0}    />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 14]} />
              <Tooltip {...TT} />
              <Area type="monotone" dataKey="medium"   stroke={C.amber}  fill="url(#gm)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="high"     stroke={C.orange} fill="url(#gh)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Area type="monotone" dataKey="critical" stroke={C.rose}   fill="url(#gc)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: C.rose }} />critical</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: C.orange }} />high</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: C.amber }} />medium</span>
          </div>
        </div>

        {/* NLP Extraction Feed */}
        <div className={`lg:col-span-2 ${CARD_BASE} flex flex-col`}>
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[var(--accent-cyan)]" />
              <p className="text-sm font-medium text-[var(--text-primary)]">NLP Extraction Feed</p>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: C.cyan }} />
              Live
            </span>
          </div>
          <div className="flex-1 divide-y divide-[var(--border)] overflow-y-auto">
            {NLP_FEED.map((n, i) => (
              <div key={i} className="px-5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-1.5">
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{ background: `${C.cyan}18`, color: C.cyan, border: `1px solid ${C.cyan}30` }}
                      >
                        {n.type}
                      </span>
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: STATUS_DOT[n.status] }}
                      />
                    </div>
                    <p className="truncate font-mono text-xs text-[var(--text-primary)]">{n.ioc}</p>
                    <p className="mt-1 truncate text-[11px] text-[var(--text-muted)]">{n.source}</p>
                  </div>
                  <ConfBar value={n.conf} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Client Correlation Matrix ── */}
      <div className={CARD_BASE}>
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4 text-[var(--accent-cyan)]" />
            <p className="text-sm font-medium text-[var(--text-primary)]">Client Correlation Matrix</p>
            <span className="text-xs text-[var(--text-muted)]">— Internal vs External match</span>
          </div>
          <Link to="/admin/threats" className="text-xs text-[var(--accent-cyan)] hover:underline flex items-center gap-1">
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Client', 'External Threat', 'Ext. Source', 'Internal Source (SIEM/EDR)', 'Asset Hit', 'Severity', 'Match'].map(h => (
                  <th key={h} className="whitespace-nowrap px-5 py-3 text-left font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {CORR_MATRIX.map((r, i) => (
                <tr key={i} className="transition-colors hover:bg-[var(--bg-tertiary)]">
                  <td className="whitespace-nowrap px-5 py-3.5 font-medium text-[var(--text-primary)]">{r.client}</td>
                  <td className="max-w-[180px] px-5 py-3.5 text-[var(--text-primary)]">
                    <p className="truncate">{r.threat}</p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-[var(--text-muted)]">{r.extSource}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-medium"
                      style={{ background: `${C.indigo}15`, color: C.indigo, border: `1px solid ${C.indigo}30` }}
                    >
                      {r.intSource}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[var(--text-muted)]">{r.asset}</td>
                  <td className="whitespace-nowrap px-5 py-3.5"><SevBadge sev={r.severity} /></td>
                  <td className="whitespace-nowrap px-5 py-3.5"><ConfBar value={r.score} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── AI Decision Support + IoC Distribution ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* AI Decision Support */}
        <div className={`lg:col-span-2 ${CARD_BASE} flex flex-col`}>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${C.cyan}18` }}>
              <Cpu className="h-4 w-4" style={{ color: C.cyan }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">AI Decision Support</p>
              <p className="text-[10px] text-[var(--text-muted)]">Generated 03/03/2026 — 14:22 UTC</p>
            </div>
            <span
              className="ml-auto rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide"
              style={{ background: `${C.cyan}15`, color: C.cyan, border: `1px solid ${C.cyan}30` }}
            >
              Auto-generated
            </span>
          </div>

          {/* Situation Summary */}
          <div className="border-b border-[var(--border)] px-6 py-6">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Situation Summary
            </p>
            <p className="text-sm leading-7 text-[var(--text-primary)]">
              The automated scan identified{' '}
              <strong style={{ color: C.rose }}>2 critical</strong> active threat actors
              (Lazarus Group C2 infrastructure, LockBit 3.0) with confirmed internal matches across{' '}
              <strong className="text-white">3 clients</strong>.
              BankCorp SA presents the highest risk with direct C2 communications observed on{' '}
              <code className="rounded px-1 py-0.5 text-[11px]" style={{ background: 'rgba(255,255,255,0.07)', color: C.cyan }}>SRV-CORE-01</code>.
              CVE-2024-3400 remains unpatched on TeleCom's perimeter firewall, constituting an immediate RCE vector.
              Immediate containment actions are required on{' '}
              <strong style={{ color: C.cyan }}>4 assets</strong>.
            </p>
          </div>

          {/* Prioritized Actions */}
          <div className="flex-1 px-6 py-6">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Prioritized Actions
            </p>
            <div className="space-y-3">
              {AI_RECOS.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-lg px-4 py-3"
                  style={{ background: `${r.color}08`, border: `1px solid ${r.color}20` }}
                >
                  <span
                    className="mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold tabular-nums"
                    style={{ background: `${r.color}22`, color: r.color, border: `1px solid ${r.color}40` }}
                  >
                    {r.priority}
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--text-primary)]">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* IoC Distribution */}
        <div className={`${CARD_BASE} flex flex-col`}>
          <div className="border-b border-[var(--border)] px-6 py-4">
            <p className="text-sm font-semibold text-[var(--text-primary)]">IoC Distribution</p>
            <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">By indicator type — total 100</p>
          </div>
          <div className="flex flex-1 flex-col justify-between px-6 py-6">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={IOC_DISTRIBUTION}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={78}
                  dataKey="value"
                  paddingAngle={4}
                  strokeWidth={0}
                >
                  {IOC_DISTRIBUTION.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip {...TT} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {IOC_DISTRIBUTION.map(e => (
                <div key={e.name} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: e.color }} />
                  <span className="flex-1 text-sm text-[var(--text-muted)]">{e.name}</span>
                  <span className="text-sm font-bold tabular-nums" style={{ color: e.color }}>{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── Recent Threats ── */}
      <div className={CARD_BASE}>
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${C.cyan}18` }}>
              <TrendingUp className="h-4 w-4" style={{ color: C.cyan }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Recent Threats</p>
              <p className="text-[10px] text-[var(--text-muted)]">{RECENT_THREATS.length} latest detections</p>
            </div>
          </div>
          <Link
            to="/admin/threats"
            className="flex items-center gap-1 text-xs font-medium text-[var(--accent-cyan)] hover:underline"
          >
            View all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {RECENT_THREATS.map(t => (
            <div key={t.id} className="flex items-center gap-5 px-6 py-4 transition-colors hover:bg-[var(--bg-tertiary)]">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">{t.title}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{t.source}</p>
              </div>
              <ScoreBadge score={t.score} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
