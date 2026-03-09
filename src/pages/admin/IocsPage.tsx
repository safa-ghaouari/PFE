import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge, ScoreBadge } from '@/components/ui/Badge'
import { Search, ChevronLeft, ChevronRight, Eye, Copy, Check } from 'lucide-react'
import type { IocSummary, IoCStatus, IoCSeverity } from '@/types/ioc.types'
import type { IoCType } from '@/utils/constants'

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_IOCS: IocSummary[] = [
  { id: 'i1',  type: 'ip',     value: '185.220.101.47',                         riskScore: 94, severity: 'critical', status: 'validated', source: 'AlienVault OTX',   lastSeen: '2026-03-04T06:00:00Z' },
  { id: 'i2',  type: 'domain', value: 'update-windows-secure.ru',                riskScore: 88, severity: 'critical', status: 'validated', source: 'Recorded Future',  lastSeen: '2026-03-03T14:00:00Z' },
  { id: 'i3',  type: 'hash',   value: 'e3b0c44298fc1c149afbf4c8996fb924',       riskScore: 72, severity: 'high',     status: 'validated', source: 'Abuse.ch',          lastSeen: '2026-03-02T10:00:00Z' },
  { id: 'i4',  type: 'url',    value: 'http://malicious.tk/payload.exe',         riskScore: 81, severity: 'critical', status: 'pending',   source: 'MISP Community',    lastSeen: '2026-03-04T01:00:00Z' },
  { id: 'i5',  type: 'email',  value: 'cfo-impersonator@secure-bank.net',        riskScore: 65, severity: 'high',     status: 'pending',   source: 'CERT-FR',           lastSeen: '2026-03-03T09:00:00Z' },
  { id: 'i6',  type: 'ip',     value: '45.142.212.100',                          riskScore: 78, severity: 'high',     status: 'validated', source: 'AlienVault OTX',   lastSeen: '2026-03-01T08:00:00Z' },
  { id: 'i7',  type: 'domain', value: 'c2-beacon-lazarus.xyz',                   riskScore: 96, severity: 'critical', status: 'validated', source: 'Recorded Future',  lastSeen: '2026-03-04T03:00:00Z' },
  { id: 'i8',  type: 'hash',   value: 'da39a3ee5e6b4b0d3255bfef95601890',       riskScore: 55, severity: 'medium',   status: 'pending',   source: 'MISP Community',    lastSeen: '2026-02-28T12:00:00Z' },
  { id: 'i9',  type: 'ip',     value: '192.168.0.254',                           riskScore: 22, severity: 'low',      status: 'rejected',  source: 'Abuse.ch',          lastSeen: '2026-02-20T07:00:00Z' },
  { id: 'i10', type: 'url',    value: 'https://phish-login.bank-secure.xyz/',    riskScore: 90, severity: 'critical', status: 'validated', source: 'CERT-FR',           lastSeen: '2026-03-03T22:00:00Z' },
  { id: 'i11', type: 'domain', value: 'dl.emotet-loader.com',                    riskScore: 82, severity: 'critical', status: 'validated', source: 'AlienVault OTX',   lastSeen: '2026-03-02T17:00:00Z' },
  { id: 'i12', type: 'ip',     value: '91.108.4.186',                            riskScore: 69, severity: 'high',     status: 'validated', source: 'Recorded Future',  lastSeen: '2026-03-01T20:00:00Z' },
  { id: 'i13', type: 'hash',   value: '5f4dcc3b5aa765d61d8327deb882cf99',       riskScore: 48, severity: 'medium',   status: 'pending',   source: 'MISP Community',    lastSeen: '2026-02-25T11:00:00Z' },
  { id: 'i14', type: 'email',  value: 'invoice-noreply@docusign-fake.co',        riskScore: 74, severity: 'high',     status: 'pending',   source: 'CERT-FR',           lastSeen: '2026-03-03T15:00:00Z' },
  { id: 'i15', type: 'url',    value: 'http://185.220.101.47/rat.ps1',           riskScore: 93, severity: 'critical', status: 'validated', source: 'Abuse.ch',          lastSeen: '2026-03-04T05:00:00Z' },
  { id: 'i16', type: 'ip',     value: '198.51.100.7',                            riskScore: 35, severity: 'low',      status: 'expired',   source: 'AlienVault OTX',   lastSeen: '2026-01-10T08:00:00Z' },
  { id: 'i17', type: 'domain', value: 'gootloader-seo-poison.info',              riskScore: 58, severity: 'medium',   status: 'validated', source: 'Recorded Future',  lastSeen: '2026-02-22T09:00:00Z' },
  { id: 'i18', type: 'hash',   value: 'aab3238922bcc25a6f606eb525ffdc56',       riskScore: 77, severity: 'high',     status: 'validated', source: 'MISP Community',    lastSeen: '2026-02-24T14:00:00Z' },
  { id: 'i19', type: 'ip',     value: '103.76.228.25',                           riskScore: 86, severity: 'critical', status: 'pending',   source: 'CERT-FR',           lastSeen: '2026-03-04T00:00:00Z' },
  { id: 'i20', type: 'email',  value: 'hr-payroll@update-credentials.ru',        riskScore: 79, severity: 'high',     status: 'validated', source: 'AlienVault OTX',   lastSeen: '2026-03-03T11:00:00Z' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<IoCStatus, string> = {
  pending:   'Pending',
  validated: 'Validated',
  rejected:  'Rejected',
  expired:   'Expired',
}

const STATUS_VARIANT: Record<IoCStatus, Parameters<typeof Badge>[0]['variant']> = {
  pending:   'info',
  validated: 'success',
  rejected:  'neutral',
  expired:   'neutral',
}

const TYPE_COLORS: Record<IoCType, string> = {
  ip:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  domain: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  hash:   'bg-orange-500/10 text-orange-400 border-orange-500/20',
  url:    'bg-pink-500/10 text-pink-400 border-pink-500/20',
  email:  'bg-teal-500/10 text-teal-400 border-teal-500/20',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const PAGE_SIZE = 10

// ── Copy-to-clipboard button ──────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-1 text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
    >
      {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminIocsPage() {
  const navigate = useNavigate()

  const [search, setSearch]     = useState('')
  const [type, setType]         = useState<IoCType | ''>('')
  const [severity, setSeverity] = useState<IoCSeverity | ''>('')
  const [status, setStatus]     = useState<IoCStatus | ''>('')
  const [page, setPage]         = useState(1)

  const filtered = useMemo(() => {
    return MOCK_IOCS.filter(ioc => {
      if (type     && ioc.type     !== type)     return false
      if (severity && ioc.severity !== severity) return false
      if (status   && ioc.status   !== status)   return false
      if (search   && !ioc.value.toLowerCase().includes(search.toLowerCase()) &&
                      !ioc.source.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, type, severity, status])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function resetFilters() {
    setSearch(''); setType(''); setSeverity(''); setStatus(''); setPage(1)
  }

  const pendingCount = MOCK_IOCS.filter(i => i.status === 'pending').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Indicators of Compromise"
        subtitle={`${filtered.length} IoCs — ${pendingCount} pending validation`}
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
            placeholder="Search value or source…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>

        <select
          value={type}
          onChange={e => { setType(e.target.value as IoCType | ''); setPage(1) }}
          className="px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
        >
          <option value="">All Types</option>
          <option value="ip">IP Address</option>
          <option value="domain">Domain</option>
          <option value="hash">Hash</option>
          <option value="url">URL</option>
          <option value="email">Email</option>
        </select>

        <select
          value={severity}
          onChange={e => { setSeverity(e.target.value as IoCSeverity | ''); setPage(1) }}
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
          onChange={e => { setStatus(e.target.value as IoCStatus | ''); setPage(1) }}
          className="px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="validated">Validated</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
        </select>

        {(search || type || severity || status) && (
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
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Value</th>
              <th className="px-4 py-3 font-medium">Severity</th>
              <th className="px-4 py-3 font-medium">Risk Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Last Seen</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[var(--text-muted)]">
                  No IoCs match the current filters.
                </td>
              </tr>
            ) : (
              paginated.map((ioc, i) => (
                <tr
                  key={ioc.id}
                  className={`border-b border-[var(--border)] hover:bg-[var(--bg-primary)] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                >
                  {/* Type */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold rounded border uppercase ${TYPE_COLORS[ioc.type]}`}>
                      {ioc.type}
                    </span>
                  </td>

                  {/* Value */}
                  <td className="px-4 py-3 max-w-[220px]">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-[var(--text-primary)] truncate">
                        {ioc.value}
                      </span>
                      <CopyButton value={ioc.value} />
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="px-4 py-3">
                    <Badge variant={ioc.severity}>
                      {ioc.severity.charAt(0).toUpperCase() + ioc.severity.slice(1)}
                    </Badge>
                  </td>

                  {/* Risk Score */}
                  <td className="px-4 py-3">
                    <ScoreBadge score={ioc.riskScore} />
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[ioc.status]}>
                      {STATUS_LABELS[ioc.status]}
                    </Badge>
                  </td>

                  {/* Source */}
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">
                    {ioc.source}
                  </td>

                  {/* Last Seen */}
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">
                    {formatDate(ioc.lastSeen)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/admin/iocs/${ioc.id}`)}
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
