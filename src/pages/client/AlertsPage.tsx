import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Search, ChevronLeft, ChevronRight, Eye, Bell } from 'lucide-react'
import type { ThreatSeverity } from '@/types/threat.types'

// ── Types ─────────────────────────────────────────────────────────────────────
type AlertStatus = 'open' | 'investigating' | 'resolved' | 'false_positive'

interface Alert {
  id: string
  title: string
  description: string
  severity: ThreatSeverity
  status: AlertStatus
  source: string
  iocCount: number
  createdAt: string
  updatedAt: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1', title: 'Critical IP Detected in Outbound Traffic',
    description: 'A known C2 server IP (185.220.101.47) was observed in outbound network logs from your infrastructure.',
    severity: 'critical', status: 'open', source: 'Network Monitor',
    iocCount: 3, createdAt: '2026-03-04T06:30:00Z', updatedAt: '2026-03-04T06:30:00Z',
  },
  {
    id: 'a2', title: 'Ransomware Domain Resolution Attempt',
    description: 'DNS query to c2-beacon-lazarus.xyz was blocked by your DNS firewall. Investigate affected workstation.',
    severity: 'critical', status: 'investigating', source: 'DNS Firewall',
    iocCount: 1, createdAt: '2026-03-03T22:15:00Z', updatedAt: '2026-03-04T08:00:00Z',
  },
  {
    id: 'a3', title: 'Phishing Email Received by 3 Users',
    description: 'Phishing campaign impersonating DocuSign delivered to mailboxes. Attachments contain Emotet dropper.',
    severity: 'high', status: 'open', source: 'Email Gateway',
    iocCount: 2, createdAt: '2026-03-03T14:00:00Z', updatedAt: '2026-03-03T14:00:00Z',
  },
  {
    id: 'a4', title: 'Suspicious PowerShell Execution',
    description: 'Encoded PowerShell command executed on WRK-042. Pattern matches Cobalt Strike post-exploitation.',
    severity: 'high', status: 'investigating', source: 'EDR Agent',
    iocCount: 1, createdAt: '2026-03-03T09:45:00Z', updatedAt: '2026-03-03T11:00:00Z',
  },
  {
    id: 'a5', title: 'Failed Login Spike — VPN Gateway',
    description: '47 failed authentication attempts on VPN in 10 minutes from external IP. Credential stuffing pattern.',
    severity: 'medium', status: 'open', source: 'SIEM',
    iocCount: 0, createdAt: '2026-03-03T07:00:00Z', updatedAt: '2026-03-03T07:00:00Z',
  },
  {
    id: 'a6', title: 'Malware Hash Found in File Share',
    description: 'SHA-256 hash matching GootLoader payload detected in shared drive folder /HR/Policies.',
    severity: 'high', status: 'resolved', source: 'AV Scanner',
    iocCount: 1, createdAt: '2026-03-02T16:30:00Z', updatedAt: '2026-03-02T18:00:00Z',
  },
  {
    id: 'a7', title: 'Unusual Admin Account Activity',
    description: 'Admin account accessed from two geographic locations (Paris, Lagos) within 30 minutes.',
    severity: 'medium', status: 'investigating', source: 'SIEM',
    iocCount: 0, createdAt: '2026-03-02T12:00:00Z', updatedAt: '2026-03-02T12:30:00Z',
  },
  {
    id: 'a8', title: 'Scanner Activity from Internal Host',
    description: 'Host 10.0.1.55 running port scan on internal subnet. May indicate lateral movement.',
    severity: 'medium', status: 'open', source: 'Network Monitor',
    iocCount: 0, createdAt: '2026-03-02T10:00:00Z', updatedAt: '2026-03-02T10:00:00Z',
  },
  {
    id: 'a9', title: 'SSL Certificate Mismatch on Internal API',
    description: 'TLS certificate CN does not match hostname on internal API endpoint. Possible MITM attempt.',
    severity: 'low', status: 'resolved', source: 'Network Monitor',
    iocCount: 0, createdAt: '2026-03-01T09:00:00Z', updatedAt: '2026-03-01T14:00:00Z',
  },
  {
    id: 'a10', title: 'Expired Certificate on Web Server',
    description: 'SSL certificate on public-facing web portal expired 2 days ago. Browsers showing security warnings.',
    severity: 'low', status: 'false_positive', source: 'Vulnerability Scanner',
    iocCount: 0, createdAt: '2026-02-28T08:00:00Z', updatedAt: '2026-02-28T15:00:00Z',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<AlertStatus, string> = {
  open:          'Open',
  investigating: 'Investigating',
  resolved:      'Resolved',
  false_positive:'False Positive',
}

const STATUS_VARIANT: Record<AlertStatus, Parameters<typeof Badge>[0]['variant']> = {
  open:          'critical',
  investigating: 'info',
  resolved:      'success',
  false_positive:'neutral',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d ago`
  if (h > 0) return `${h}h ago`
  return 'Just now'
}

const PAGE_SIZE = 8

// ── Component ─────────────────────────────────────────────────────────────────
export default function AlertsPage() {
  const navigate = useNavigate()

  const [search, setSearch]     = useState('')
  const [severity, setSeverity] = useState<ThreatSeverity | ''>('')
  const [status, setStatus]     = useState<AlertStatus | ''>('')
  const [page, setPage]         = useState(1)

  const filtered = useMemo(() => {
    return MOCK_ALERTS.filter(a => {
      if (severity && a.severity !== severity) return false
      if (status   && a.status   !== status)   return false
      if (search   && !a.title.toLowerCase().includes(search.toLowerCase()) &&
                      !a.description.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, severity, status])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openCount = MOCK_ALERTS.filter(a => a.status === 'open').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Alerts"
        subtitle={`${openCount} open alerts — ${MOCK_ALERTS.length} total`}
      />

      {/* ── Open alert banner ── */}
      {openCount > 0 && (
        <div className="flex items-center gap-3 rounded border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm">
          <Bell className="h-4 w-4 text-red-400 shrink-0" />
          <span className="text-red-300">
            You have <strong>{openCount}</strong> open alert{openCount > 1 ? 's' : ''} requiring attention.
          </span>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search alerts…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)]"
          />
        </div>

        <select
          value={severity}
          onChange={e => { setSeverity(e.target.value as ThreatSeverity | ''); setPage(1) }}
          className="px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={status}
          onChange={e => { setStatus(e.target.value as AlertStatus | ''); setPage(1) }}
          className="px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
        >
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="false_positive">False Positive</option>
        </select>

        {(search || severity || status) && (
          <button
            onClick={() => { setSearch(''); setSeverity(''); setStatus(''); setPage(1) }}
            className="px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Alert cards ── */}
      <div className="space-y-3">
        {paginated.length === 0 ? (
          <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-12 text-center text-sm text-[var(--text-muted)]">
            No alerts match the current filters.
          </div>
        ) : (
          paginated.map(alert => (
            <div
              key={alert.id}
              className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-4 hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
              onClick={() => navigate(`/alerts/${alert.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge variant={alert.severity}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Badge>
                    <Badge variant={STATUS_VARIANT[alert.status]}>
                      {STATUS_LABELS[alert.status]}
                    </Badge>
                    {alert.iocCount > 0 && (
                      <span className="text-xs text-[var(--text-muted)]">
                        {alert.iocCount} IoC{alert.iocCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-[var(--text-primary)] text-sm mb-1">{alert.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">{alert.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span>{alert.source}</span>
                    <span>·</span>
                    <span>{timeAgo(alert.createdAt)}</span>
                  </div>
                </div>

                {/* Action */}
                <button
                  className="flex items-center gap-1 text-xs text-[var(--accent-cyan)] hover:text-white transition-colors shrink-0 mt-1"
                  onClick={e => { e.stopPropagation(); navigate(`/alerts/${alert.id}`) }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  n === currentPage
                    ? 'bg-[var(--accent-cyan)] text-black font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
