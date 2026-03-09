import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { ExternalLink, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import type { ThreatSummary, ThreatSeverity, ThreatStatus } from '@/types/threat.types'

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_THREATS: ThreatSummary[] = [
  { id: 't1',  title: 'APT29 Phishing Campaign Targeting EU Finance Sector',  source: 'AlienVault OTX',    severity: 'critical', riskScore: 92, status: 'confirmed',      iocCount: 14, publishedAt: '2026-03-01T08:00:00Z' },
  { id: 't2',  title: 'Cobalt Strike Beacon Distributed via Macro-Laced DOCX', source: 'MISP Community',   severity: 'high',     riskScore: 76, status: 'in_review',     iocCount: 8,  publishedAt: '2026-03-02T10:30:00Z' },
  { id: 't3',  title: 'Log4Shell Exploitation Attempts on Exposed Servers',    source: 'Abuse.ch',         severity: 'critical', riskScore: 95, status: 'confirmed',      iocCount: 22, publishedAt: '2026-02-28T14:00:00Z' },
  { id: 't4',  title: 'New Ransomware Variant — BlackCat v3 IOCs Released',    source: 'Recorded Future',  severity: 'critical', riskScore: 88, status: 'new',           iocCount: 31, publishedAt: '2026-03-03T06:15:00Z' },
  { id: 't5',  title: 'DNS Hijacking Campaign Affecting North African ISPs',   source: 'CERT-FR',          severity: 'high',     riskScore: 70, status: 'confirmed',      iocCount: 5,  publishedAt: '2026-02-27T09:45:00Z' },
  { id: 't6',  title: 'Emotet Banking Trojan Resurgence — Wave 14',            source: 'AlienVault OTX',   severity: 'high',     riskScore: 73, status: 'in_review',     iocCount: 18, publishedAt: '2026-03-01T16:00:00Z' },
  { id: 't7',  title: 'Supply Chain Attack on Open-Source NPM Packages',       source: 'MISP Community',   severity: 'medium',   riskScore: 55, status: 'new',           iocCount: 3,  publishedAt: '2026-03-02T11:00:00Z' },
  { id: 't8',  title: 'Credential Stuffing Attacks on Banking Portals',        source: 'Abuse.ch',         severity: 'medium',   riskScore: 48, status: 'false_positive', iocCount: 0,  publishedAt: '2026-02-25T13:20:00Z' },
  { id: 't9',  title: 'Lazarus Group C2 Infrastructure Identified',             source: 'Recorded Future',  severity: 'critical', riskScore: 91, status: 'confirmed',      iocCount: 9,  publishedAt: '2026-03-03T08:00:00Z' },
  { id: 't10', title: 'Ivanti VPN Zero-Day Actively Exploited in the Wild',    source: 'CERT-FR',          severity: 'critical', riskScore: 97, status: 'confirmed',      iocCount: 7,  publishedAt: '2026-03-04T00:30:00Z' },
  { id: 't11', title: 'Agent Tesla Keylogger Spreading via Spear-Phishing',    source: 'AlienVault OTX',   severity: 'high',     riskScore: 68, status: 'in_review',     iocCount: 11, publishedAt: '2026-03-01T12:00:00Z' },
  { id: 't12', title: 'Mirai Botnet Variant Targeting IoT Devices in MENA',    source: 'Abuse.ch',         severity: 'medium',   riskScore: 52, status: 'new',           iocCount: 4,  publishedAt: '2026-02-26T07:10:00Z' },
  { id: 't13', title: 'RedLine Stealer C2 Domains Observed in Telemetry',      source: 'MISP Community',   severity: 'high',     riskScore: 74, status: 'confirmed',      iocCount: 6,  publishedAt: '2026-03-02T09:00:00Z' },
  { id: 't14', title: 'Water-Holing Attack on Government Infrastructure Sites', source: 'Recorded Future',  severity: 'critical', riskScore: 89, status: 'in_review',     iocCount: 2,  publishedAt: '2026-03-03T14:00:00Z' },
  { id: 't15', title: 'SSH Brute-Force Spike from Tor Exit Nodes',             source: 'Abuse.ch',         severity: 'low',      riskScore: 28, status: 'resolved',      iocCount: 0,  publishedAt: '2026-02-20T08:30:00Z' },
  { id: 't16', title: 'DarkGate RAT Campaign Targets European Manufacturing',   source: 'AlienVault OTX',   severity: 'high',     riskScore: 77, status: 'confirmed',      iocCount: 13, publishedAt: '2026-02-24T11:45:00Z' },
  { id: 't17', title: 'GootLoader Malware via SEO-Poisoned Search Results',    source: 'CERT-FR',          severity: 'medium',   riskScore: 50, status: 'new',           iocCount: 2,  publishedAt: '2026-02-22T15:20:00Z' },
  { id: 't18', title: 'BEC Campaign Spoofing CFOs at Multinational Firms',     source: 'MISP Community',   severity: 'high',     riskScore: 65, status: 'in_review',     iocCount: 1,  publishedAt: '2026-03-03T10:00:00Z' },
  { id: 't19', title: 'XZ Utils Backdoor — Legacy Systems Still Vulnerable',   source: 'Recorded Future',  severity: 'critical', riskScore: 93, status: 'confirmed',      iocCount: 3,  publishedAt: '2026-02-18T06:00:00Z' },
  { id: 't20', title: 'Mass Exploitation of Fortinet FortiOS Auth Bypass',     source: 'CERT-FR',          severity: 'critical', riskScore: 96, status: 'confirmed',      iocCount: 17, publishedAt: '2026-03-04T02:00:00Z' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<ThreatStatus, string> = {
  new:           'New',
  in_review:     'In Review',
  confirmed:     'Confirmed',
  false_positive:'False Positive',
  resolved:      'Resolved',
}

const STATUS_VARIANT: Record<ThreatStatus, 'neutral' | 'info' | 'critical' | 'success' | 'medium'> = {
  new:           'neutral',
  in_review:     'info',
  confirmed:     'critical',
  false_positive:'neutral',
  resolved:      'success',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const PAGE_SIZE = 10

// ── Component ─────────────────────────────────────────────────────────────────
export default function ThreatsPage() {
  const navigate = useNavigate()

  const [search, setSearch]       = useState('')
  const [severity, setSeverity]   = useState<ThreatSeverity | ''>('')
  const [status, setStatus]       = useState<ThreatStatus | ''>('')
  const [page, setPage]           = useState(1)

  const filtered = useMemo(() => {
    return MOCK_THREATS.filter(t => {
      if (severity && t.severity !== severity) return false
      if (status   && t.status   !== status)   return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
                    !t.source.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, severity, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function resetFilters() {
    setSearch(''); setSeverity(''); setStatus(''); setPage(1)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Threats"
        subtitle={`${filtered.length} threat intelligence articles collected`}
      />

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex flex-1 min-w-[220px] items-center gap-0 rounded border border-[var(--border)] bg-[var(--bg-secondary)] focus-within:border-[var(--accent-cyan)] transition-colors">
          {/* icon zone — clearly separated */}
          <div className="flex h-full items-center px-3">
            <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          </div>
          {/* vertical divider */}
          <div className="h-5 w-px bg-[var(--border)]" />
          {/* text input */}
          <input
            type="text"
            placeholder="Search title or source…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>

        {/* Severity filter */}
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

        {/* Status filter */}
        <select
          value={status}
          onChange={e => { setStatus(e.target.value as ThreatStatus | ''); setPage(1) }}
          className="px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="in_review">In Review</option>
          <option value="confirmed">Confirmed</option>
          <option value="false_positive">False Positive</option>
          <option value="resolved">Resolved</option>
        </select>

        {(search || severity || status) && (
          <button
            onClick={resetFilters}
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
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Risk Score</th>
              <th className="px-4 py-3 font-medium">IoCs</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[var(--text-muted)]">
                  No threats match the current filters.
                </td>
              </tr>
            ) : (
              paginated.map((threat, i) => (
                <tr
                  key={threat.id}
                  className={`border-b border-[var(--border)] hover:bg-[var(--bg-primary)] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                >
                  {/* Title */}
                  <td className="px-4 py-3 max-w-xs">
                    <span className="line-clamp-2 text-[var(--text-primary)] font-medium leading-snug">
                      {threat.title}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="px-4 py-3 text-[var(--text-muted)] whitespace-nowrap">
                    <span className="flex items-center gap-2">
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      <span>{threat.source}</span>
                    </span>
                  </td>

                  {/* Severity */}
                  <td className="px-4 py-3">
                    <Badge variant={threat.severity}>
                      {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
                    </Badge>
                  </td>

                  {/* Risk Score */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${threat.riskScore}%`,
                            backgroundColor:
                              threat.riskScore >= 80 ? '#FF4444' :
                              threat.riskScore >= 60 ? '#FF8C00' :
                              threat.riskScore >= 40 ? '#FFD700' : '#00C853',
                          }}
                        />
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">{threat.riskScore}</span>
                    </div>
                  </td>

                  {/* IoC Count */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-[var(--text-primary)] font-mono text-xs">
                      {threat.iocCount}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[threat.status] as Parameters<typeof Badge>[0]['variant']}>
                      {STATUS_LABELS[threat.status]}
                    </Badge>
                  </td>

                  {/* Published */}
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">
                    {formatDate(threat.publishedAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/admin/threats/${threat.id}`)}
                      className="flex items-center gap-1 text-xs text-[var(--accent-cyan)] hover:text-white transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
