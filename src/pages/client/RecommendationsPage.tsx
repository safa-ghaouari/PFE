import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { ChevronDown, ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import type { ThreatSeverity } from '@/types/threat.types'

// ── Types ─────────────────────────────────────────────────────────────────────
type RecoStatus = 'pending' | 'in_progress' | 'done'

interface RecoStep {
  id: string
  label: string
  done: boolean
}

interface Recommendation {
  id: string
  title: string
  severity: ThreatSeverity
  category: string
  summary: string
  rationale: string
  steps: RecoStep[]
  status: RecoStatus
  linkedAlertId?: string
  dueDate?: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_RECOS: Recommendation[] = [
  {
    id: 'r1',
    title: 'Block C2 IP 185.220.101.47 at Firewall',
    severity: 'critical',
    category: 'Network',
    summary: 'A known Lazarus Group C2 server has been detected in your outbound traffic. Immediate blocking is required.',
    rationale: 'This IP is listed on multiple threat intel feeds and is actively used in ransomware campaigns targeting the financial sector.',
    status: 'pending',
    linkedAlertId: 'a1',
    dueDate: '2026-03-05',
    steps: [
      { id: 's1', label: 'Identify firewall rules that allow outbound to this IP', done: false },
      { id: 's2', label: 'Create deny rule for 185.220.101.47/32 on perimeter firewall', done: false },
      { id: 's3', label: 'Verify rule is applied to all VLAN segments', done: false },
      { id: 's4', label: 'Review logs for any further hits post-blocking', done: false },
    ],
  },
  {
    id: 'r2',
    title: 'Isolate and Re-image Workstation WRK-042',
    severity: 'critical',
    category: 'Endpoint',
    summary: 'Workstation WRK-042 shows signs of Cobalt Strike infection following suspicious PowerShell execution.',
    rationale: 'Post-exploitation activity detected. Risk of lateral movement and credential harvesting is high.',
    status: 'in_progress',
    linkedAlertId: 'a4',
    dueDate: '2026-03-05',
    steps: [
      { id: 's1', label: 'Isolate WRK-042 from the network immediately', done: true },
      { id: 's2', label: 'Collect forensic memory dump and disk image', done: true },
      { id: 's3', label: 'Revoke and rotate credentials of logged-in user', done: false },
      { id: 's4', label: 'Re-image workstation from clean baseline', done: false },
      { id: 's5', label: 'Verify no lateral movement to adjacent hosts', done: false },
    ],
  },
  {
    id: 'r3',
    title: 'Enable MFA on All VPN Accounts',
    severity: 'high',
    category: 'Identity',
    summary: 'Credential stuffing attack targeting VPN gateway detected. MFA will prevent account takeover.',
    rationale: '47 failed logins in 10 minutes. Without MFA, successful credential spray may lead to unauthorized VPN access.',
    status: 'pending',
    linkedAlertId: 'a5',
    dueDate: '2026-03-07',
    steps: [
      { id: 's1', label: 'Audit VPN accounts lacking MFA enrollment', done: false },
      { id: 's2', label: 'Send enrollment instructions to affected users', done: false },
      { id: 's3', label: 'Enforce MFA requirement in VPN gateway config', done: false },
      { id: 's4', label: 'Monitor for bypass attempts over next 7 days', done: false },
    ],
  },
  {
    id: 'r4',
    title: 'Patch Log4j on Exposed Java Services',
    severity: 'critical',
    category: 'Patch Management',
    summary: 'Log4Shell (CVE-2021-44228) exploitation attempts detected in web server logs. Unpatched instances must be updated.',
    rationale: 'Critical severity RCE vulnerability actively exploited. Any unpatched Log4j version ≤ 2.14.1 is at risk.',
    status: 'done',
    dueDate: '2026-03-01',
    steps: [
      { id: 's1', label: 'Inventory all Java services using Log4j', done: true },
      { id: 's2', label: 'Update Log4j to ≥ 2.17.1 on each service', done: true },
      { id: 's3', label: 'Restart affected services and verify operation', done: true },
      { id: 's4', label: 'Enable WAF rule to block Log4Shell payloads', done: true },
    ],
  },
  {
    id: 'r5',
    title: 'User Awareness Training — Phishing Simulation',
    severity: 'medium',
    category: 'Awareness',
    summary: 'Three users opened phishing emails mimicking DocuSign. Training should be conducted promptly.',
    rationale: 'Human error remains the primary attack vector. Targeted training for affected users reduces recurrence.',
    status: 'pending',
    linkedAlertId: 'a3',
    dueDate: '2026-03-14',
    steps: [
      { id: 's1', label: 'Identify the 3 users who interacted with the phishing email', done: false },
      { id: 's2', label: 'Schedule mandatory phishing awareness session', done: false },
      { id: 's3', label: 'Run simulated phishing campaign 30 days post-training', done: false },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<RecoStatus, string> = {
  pending:     'Pending',
  in_progress: 'In Progress',
  done:        'Done',
}

const STATUS_VARIANT: Record<RecoStatus, Parameters<typeof Badge>[0]['variant']> = {
  pending:     'neutral',
  in_progress: 'info',
  done:        'success',
}

const CATEGORY_COLORS: Record<string, string> = {
  Network:          'text-blue-400',
  Endpoint:         'text-orange-400',
  Identity:         'text-purple-400',
  'Patch Management': 'text-yellow-400',
  Awareness:        'text-teal-400',
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function RecommendationsPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [steps, setSteps]       = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    MOCK_RECOS.forEach(r => r.steps.forEach(s => { init[`${r.id}-${s.id}`] = s.done }))
    return init
  })

  function toggleExpand(id: string) {
    setExpanded(prev => prev === id ? null : id)
  }

  function toggleStep(recoId: string, stepId: string) {
    const key = `${recoId}-${stepId}`
    setSteps(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const pendingCount    = MOCK_RECOS.filter(r => r.status === 'pending').length
  const inProgressCount = MOCK_RECOS.filter(r => r.status === 'in_progress').length
  const doneCount       = MOCK_RECOS.filter(r => r.status === 'done').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommendations"
        subtitle={`${MOCK_RECOS.length} remediation actions — ${pendingCount} pending, ${inProgressCount} in progress`}
      />

      {/* ── Summary ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending',     count: pendingCount,    color: 'text-[var(--text-muted)]' },
          { label: 'In Progress', count: inProgressCount, color: 'text-blue-400'            },
          { label: 'Completed',   count: doneCount,       color: 'text-green-400'           },
        ].map(s => (
          <div key={s.label} className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Recommendation cards ── */}
      <div className="space-y-3">
        {MOCK_RECOS.map(reco => {
          const isExpanded = expanded === reco.id
          const stepsDone  = reco.steps.filter(s => steps[`${reco.id}-${s.id}`]).length
          const stepsTotal = reco.steps.length
          const pct        = stepsTotal ? Math.round((stepsDone / stepsTotal) * 100) : 0

          return (
            <div
              key={reco.id}
              className={`rounded border bg-[var(--bg-secondary)] transition-colors ${
                reco.status === 'done' ? 'border-green-500/20 opacity-70' : 'border-[var(--border)]'
              }`}
            >
              {/* Header row */}
              <button
                onClick={() => toggleExpand(reco.id)}
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                {/* Expand icon */}
                <span className="mt-0.5 text-[var(--text-muted)] shrink-0">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant={reco.severity}>
                      {reco.severity.charAt(0).toUpperCase() + reco.severity.slice(1)}
                    </Badge>
                    <Badge variant={STATUS_VARIANT[reco.status]}>
                      {STATUS_LABEL[reco.status]}
                    </Badge>
                    <span className={`text-xs font-medium ${CATEGORY_COLORS[reco.category] ?? 'text-[var(--text-muted)]'}`}>
                      {reco.category}
                    </span>
                    {reco.dueDate && (
                      <span className="text-xs text-[var(--text-muted)]">
                        Due {new Date(reco.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-[var(--text-primary)] text-sm">{reco.title}</h3>
                  <p className="mt-1 text-xs text-[var(--text-muted)] line-clamp-1">{reco.summary}</p>
                </div>

                {/* Progress */}
                <div className="shrink-0 flex flex-col items-end gap-1 ml-4">
                  <span className="text-xs text-[var(--text-muted)]">{stepsDone}/{stepsTotal} steps</span>
                  <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--accent-cyan)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="border-t border-[var(--border)] px-4 pb-4 pt-3 space-y-4">
                  {/* Rationale */}
                  <div>
                    <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">Rationale</div>
                    <p className="text-sm text-[var(--text-primary)] leading-relaxed">{reco.rationale}</p>
                  </div>

                  {/* Checklist */}
                  <div>
                    <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-2">Action Steps</div>
                    <div className="space-y-2">
                      {reco.steps.map((step, idx) => {
                        const key  = `${reco.id}-${step.id}`
                        const done = steps[key]
                        return (
                          <label
                            key={step.id}
                            className="flex items-start gap-2.5 cursor-pointer group"
                          >
                            <button
                              onClick={() => toggleStep(reco.id, step.id)}
                              className="mt-0.5 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] transition-colors"
                            >
                              {done
                                ? <CheckCircle2 className="h-4 w-4 text-green-400" />
                                : <Circle className="h-4 w-4" />
                              }
                            </button>
                            <span className={`text-sm leading-snug ${done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                              <span className="text-[var(--text-muted)] mr-1.5">{idx + 1}.</span>
                              {step.label}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
