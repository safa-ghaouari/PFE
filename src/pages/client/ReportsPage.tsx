import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Download, FileText, RefreshCw } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type ReportStatus = 'ready' | 'generating' | 'failed'
type ReportPeriod = 'weekly' | 'monthly' | 'quarterly'

interface Report {
  id: string
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

// ── Mock data (scoped to logged-in client) ────────────────────────────────────
const MY_REPORTS: Report[] = [
  { id: 'rp10', title: 'Weekly Threat Report — W09 2026',  period: 'weekly',    periodLabel: '24 Feb–2 Mar 2026', status: 'generating', generatedAt: undefined,              sizeKb: 0,    threatCount: 0,  iocCount: 0,  riskScore: 0  },
  { id: 'rp1',  title: 'Weekly Threat Report — W08 2026',  period: 'weekly',    periodLabel: '17–23 Feb 2026',    status: 'ready',      generatedAt: '2026-02-24T08:00:00Z', sizeKb: 842,  threatCount: 12, iocCount: 34, riskScore: 78 },
  { id: 'rp4',  title: 'Monthly Threat Report — Feb 2026', period: 'monthly',   periodLabel: 'February 2026',     status: 'ready',      generatedAt: '2026-03-01T09:00:00Z', sizeKb: 2140, threatCount: 41, iocCount: 97, riskScore: 82 },
  { id: 'rp8',  title: 'Q4 2025 Security Summary',         period: 'quarterly', periodLabel: 'Q4 2025',           status: 'ready',      generatedAt: '2026-01-05T08:00:00Z', sizeKb: 5200, threatCount: 98, iocCount: 241, riskScore: 80 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_VARIANT: Record<ReportStatus, Parameters<typeof Badge>[0]['variant']> = {
  ready:      'success',
  generating: 'info',
  failed:     'critical',
}

const PERIOD_ICON: Record<ReportPeriod, string> = {
  weekly:    'W',
  monthly:   'M',
  quarterly: 'Q',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ClientReportsPage() {
  const readyCount = MY_REPORTS.filter(r => r.status === 'ready').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Reports"
        subtitle={`${readyCount} reports available for download`}
      />

      <div className="space-y-3">
        {MY_REPORTS.map(report => (
          <div
            key={report.id}
            className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
          >
            <div className="flex items-start gap-4">
              {/* Period icon */}
              <div className="h-10 w-10 rounded bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-[var(--accent-cyan)]">{PERIOD_ICON[report.period]}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge variant={STATUS_VARIANT[report.status]}>
                    {report.status === 'generating' ? (
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                        Generating…
                      </span>
                    ) : report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                  <span className="text-xs text-[var(--text-muted)]">{report.periodLabel}</span>
                </div>
                <h3 className="font-medium text-[var(--text-primary)] text-sm">{report.title}</h3>

                {report.status === 'ready' && (
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
                    <span><strong className="text-[var(--text-primary)]">{report.threatCount}</strong> threats</span>
                    <span><strong className="text-[var(--text-primary)]">{report.iocCount}</strong> IoCs</span>
                    <span>
                      Risk score:{' '}
                      <strong style={{
                        color: report.riskScore >= 80 ? '#FF4444' :
                               report.riskScore >= 60 ? '#FF8C00' :
                               report.riskScore >= 40 ? '#FFD700' : '#00C853',
                      }}>
                        {report.riskScore}
                      </strong>
                    </span>
                    {report.generatedAt && (
                      <span>Generated {formatDate(report.generatedAt)}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Download */}
              {report.status === 'ready' && (
                <button className="flex items-center gap-2 px-3 py-2 rounded border border-[var(--border)] text-xs text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10 transition-colors shrink-0">
                  <FileText className="h-3.5 w-3.5" />
                  <Download className="h-3.5 w-3.5" />
                  PDF — {formatSize(report.sizeKb!)}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
