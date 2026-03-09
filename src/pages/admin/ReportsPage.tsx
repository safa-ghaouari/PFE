import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Search, Download, FileText, RefreshCw } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type ReportStatus = 'ready' | 'generating' | 'failed'
type ReportPeriod = 'weekly' | 'monthly' | 'quarterly' | 'custom'

interface Report {
  id: string
  clientName: string
  clientId: string
  title: string
  period: ReportPeriod
  periodLabel: string
  status: ReportStatus
  generatedAt?: string
  sizeKb?: number
  threatCount: number
  iocCount: number
  riskScore: number
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_REPORTS: Report[] = [
  { id: 'rp1',  clientName: 'BankCorp SA',        clientId: 'c1', title: 'Weekly Threat Report — W08 2026',    period: 'weekly',    periodLabel: '17–23 Feb 2026', status: 'ready',      generatedAt: '2026-02-24T08:00:00Z', sizeKb: 842,  threatCount: 12, iocCount: 34, riskScore: 78 },
  { id: 'rp2',  clientName: 'TeleCom Group',       clientId: 'c2', title: 'Weekly Threat Report — W08 2026',    period: 'weekly',    periodLabel: '17–23 Feb 2026', status: 'ready',      generatedAt: '2026-02-24T08:30:00Z', sizeKb: 620,  threatCount: 7,  iocCount: 18, riskScore: 61 },
  { id: 'rp3',  clientName: 'HealthNet',           clientId: 'c3', title: 'Weekly Threat Report — W08 2026',    period: 'weekly',    periodLabel: '17–23 Feb 2026', status: 'failed',     generatedAt: undefined,              sizeKb: 0,    threatCount: 0,  iocCount: 0,  riskScore: 0  },
  { id: 'rp4',  clientName: 'BankCorp SA',        clientId: 'c1', title: 'Monthly Threat Report — Feb 2026',   period: 'monthly',   periodLabel: 'February 2026',  status: 'ready',      generatedAt: '2026-03-01T09:00:00Z', sizeKb: 2140, threatCount: 41, iocCount: 97, riskScore: 82 },
  { id: 'rp5',  clientName: 'TeleCom Group',       clientId: 'c2', title: 'Monthly Threat Report — Feb 2026',   period: 'monthly',   periodLabel: 'February 2026',  status: 'ready',      generatedAt: '2026-03-01T09:15:00Z', sizeKb: 1780, threatCount: 28, iocCount: 64, riskScore: 67 },
  { id: 'rp6',  clientName: 'HealthNet',           clientId: 'c3', title: 'Monthly Threat Report — Feb 2026',   period: 'monthly',   periodLabel: 'February 2026',  status: 'ready',      generatedAt: '2026-03-01T10:00:00Z', sizeKb: 1350, threatCount: 19, iocCount: 43, riskScore: 55 },
  { id: 'rp7',  clientName: 'Energia Corp',        clientId: 'c4', title: 'Monthly Threat Report — Feb 2026',   period: 'monthly',   periodLabel: 'February 2026',  status: 'ready',      generatedAt: '2026-03-01T10:30:00Z', sizeKb: 980,  threatCount: 9,  iocCount: 22, riskScore: 44 },
  { id: 'rp8',  clientName: 'BankCorp SA',        clientId: 'c1', title: 'Q4 2025 Security Summary',           period: 'quarterly', periodLabel: 'Q4 2025',        status: 'ready',      generatedAt: '2026-01-05T08:00:00Z', sizeKb: 5200, threatCount: 98, iocCount: 241, riskScore: 80 },
  { id: 'rp9',  clientName: 'TeleCom Group',       clientId: 'c2', title: 'Q4 2025 Security Summary',           period: 'quarterly', periodLabel: 'Q4 2025',        status: 'ready',      generatedAt: '2026-01-05T08:30:00Z', sizeKb: 4100, threatCount: 74, iocCount: 183, riskScore: 63 },
  { id: 'rp10', clientName: 'BankCorp SA',        clientId: 'c1', title: 'Weekly Threat Report — W09 2026',    period: 'weekly',    periodLabel: '24 Feb–2 Mar 2026', status: 'generating', generatedAt: undefined,              sizeKb: 0,    threatCount: 0,  iocCount: 0,  riskScore: 0  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_VARIANT: Record<ReportStatus, Parameters<typeof Badge>[0]['variant']> = {
  ready:      'success',
  generating: 'info',
  failed:     'critical',
}

const PERIOD_VARIANT: Record<ReportPeriod, Parameters<typeof Badge>[0]['variant']> = {
  weekly:    'neutral',
  monthly:   'info',
  quarterly: 'medium',
  custom:    'neutral',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [search, setSearch]     = useState('')
  const [client, setClient]     = useState('')
  const [period, setPeriod]     = useState<ReportPeriod | ''>('')

  const clients = [...new Set(MOCK_REPORTS.map(r => r.clientName))].sort()

  const filtered = useMemo(() => {
    return MOCK_REPORTS.filter(r => {
      if (client && r.clientName !== client) return false
      if (period && r.period    !== period)  return false
      if (search && !r.title.toLowerCase().includes(search.toLowerCase()) &&
                    !r.clientName.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, client, period])

  const readyCount = MOCK_REPORTS.filter(r => r.status === 'ready').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle={`${readyCount} reports ready — ${MOCK_REPORTS.length} total across all clients`}
      />

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-1 min-w-[220px] items-center rounded border border-[var(--border)] bg-[var(--bg-secondary)] focus-within:border-[var(--accent-cyan)] transition-colors">
          <div className="flex h-full items-center px-3">
            <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          </div>
          <div className="h-5 w-px bg-[var(--border)]" />
          <input
            type="text"
            placeholder="Search reports…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>

        <select
          value={client}
          onChange={e => setClient(e.target.value)}
          className="px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
        >
          <option value="">All Clients</option>
          {clients.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={period}
          onChange={e => setPeriod(e.target.value as ReportPeriod | '')}
          className="px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
        >
          <option value="">All Periods</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>

        {(search || client || period) && (
          <button
            onClick={() => { setSearch(''); setClient(''); setPeriod('') }}
            className="px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--text-muted)] uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Report</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Period</th>
              <th className="px-4 py-3 font-medium">Threats</th>
              <th className="px-4 py-3 font-medium">IoCs</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Generated</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-[var(--text-muted)]">
                  No reports match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((report, i) => (
                <tr
                  key={report.id}
                  className={`border-b border-[var(--border)] hover:bg-[var(--bg-primary)] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                >
                  {/* Title */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--text-muted)] shrink-0" />
                      <div>
                        <div className="text-[var(--text-primary)] font-medium text-xs leading-tight line-clamp-1">{report.title}</div>
                        <div className="text-[var(--text-muted)] text-xs">{report.periodLabel}</div>
                      </div>
                    </div>
                  </td>

                  {/* Client */}
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">{report.clientName}</td>

                  {/* Period */}
                  <td className="px-4 py-3">
                    <Badge variant={PERIOD_VARIANT[report.period]}>
                      {report.period.charAt(0).toUpperCase() + report.period.slice(1)}
                    </Badge>
                  </td>

                  {/* Threats */}
                  <td className="px-4 py-3 text-xs text-[var(--text-primary)] font-mono text-center">
                    {report.threatCount || '—'}
                  </td>

                  {/* IoCs */}
                  <td className="px-4 py-3 text-xs text-[var(--text-primary)] font-mono text-center">
                    {report.iocCount || '—'}
                  </td>

                  {/* Risk Score */}
                  <td className="px-4 py-3">
                    {report.riskScore > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${report.riskScore}%`,
                              backgroundColor:
                                report.riskScore >= 80 ? '#FF4444' :
                                report.riskScore >= 60 ? '#FF8C00' :
                                report.riskScore >= 40 ? '#FFD700' : '#00C853',
                            }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">{report.riskScore}</span>
                      </div>
                    ) : <span className="text-xs text-[var(--text-muted)]">—</span>}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {report.status === 'generating' && (
                        <RefreshCw className="h-3 w-3 text-blue-400 animate-spin" />
                      )}
                      <Badge variant={STATUS_VARIANT[report.status]}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    </div>
                  </td>

                  {/* Generated */}
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">
                    {report.generatedAt ? formatDate(report.generatedAt) : '—'}
                  </td>

                  {/* Download */}
                  <td className="px-4 py-3">
                    {report.status === 'ready' && (
                      <button className="flex items-center gap-1 text-xs text-[var(--accent-cyan)] hover:text-white transition-colors">
                        <Download className="h-3.5 w-3.5" />
                        {formatSize(report.sizeKb!)}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
