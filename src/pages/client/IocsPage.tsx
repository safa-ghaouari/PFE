import { useState, useMemo } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge, ScoreBadge } from '@/components/ui/Badge'
import { Search, Copy, Check } from 'lucide-react'
import type { IoCType } from '@/utils/constants'
import type { IoCSeverity } from '@/types/ioc.types'

// ── Types ─────────────────────────────────────────────────────────────────────
interface ClientIoC {
  id: string
  type: IoCType
  value: string
  riskScore: number
  severity: IoCSeverity
  source: string
  firstSeen: string
  lastSeen: string
}

// ── Mock data — scoped to logged-in client's tenant ───────────────────────────
const MY_IOCS: ClientIoC[] = [
  { id: 'ci1',  type: 'ip',     value: '185.220.101.47',                       riskScore: 94, severity: 'critical', source: 'AlienVault OTX',  firstSeen: '2026-03-01T00:00:00Z', lastSeen: '2026-03-04T06:00:00Z' },
  { id: 'ci2',  type: 'domain', value: 'c2-beacon-lazarus.xyz',                riskScore: 96, severity: 'critical', source: 'Recorded Future', firstSeen: '2026-03-02T00:00:00Z', lastSeen: '2026-03-04T03:00:00Z' },
  { id: 'ci3',  type: 'url',    value: 'https://phish-login.bank-secure.xyz/', riskScore: 90, severity: 'critical', source: 'CERT-FR',         firstSeen: '2026-03-03T00:00:00Z', lastSeen: '2026-03-03T22:00:00Z' },
  { id: 'ci4',  type: 'hash',   value: 'e3b0c44298fc1c149afbf4c8996fb924',     riskScore: 72, severity: 'high',     source: 'Abuse.ch',        firstSeen: '2026-03-02T00:00:00Z', lastSeen: '2026-03-02T10:00:00Z' },
  { id: 'ci5',  type: 'email',  value: 'invoice-noreply@docusign-fake.co',     riskScore: 74, severity: 'high',     source: 'CERT-FR',         firstSeen: '2026-03-03T00:00:00Z', lastSeen: '2026-03-03T15:00:00Z' },
  { id: 'ci6',  type: 'ip',     value: '45.142.212.100',                       riskScore: 78, severity: 'high',     source: 'AlienVault OTX',  firstSeen: '2026-03-01T00:00:00Z', lastSeen: '2026-03-01T08:00:00Z' },
  { id: 'ci7',  type: 'domain', value: 'dl.emotet-loader.com',                 riskScore: 82, severity: 'critical', source: 'AlienVault OTX',  firstSeen: '2026-03-01T00:00:00Z', lastSeen: '2026-03-02T17:00:00Z' },
  { id: 'ci8',  type: 'hash',   value: 'aab3238922bcc25a6f606eb525ffdc56',     riskScore: 77, severity: 'high',     source: 'MISP Community',  firstSeen: '2026-02-24T00:00:00Z', lastSeen: '2026-02-24T14:00:00Z' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
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

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
    >
      {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ClientIocsPage() {
  const [search, setSearch]     = useState('')
  const [type, setType]         = useState<IoCType | ''>('')
  const [severity, setSeverity] = useState<IoCSeverity | ''>('')

  const filtered = useMemo(() => {
    return MY_IOCS.filter(ioc => {
      if (type     && ioc.type     !== type)     return false
      if (severity && ioc.severity !== severity) return false
      if (search   && !ioc.value.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, type, severity])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Indicators of Compromise"
        subtitle={`${MY_IOCS.length} active IoCs linked to your organization`}
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
            placeholder="Search IoC value…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
        </div>

        <select
          value={type}
          onChange={e => setType(e.target.value as IoCType | '')}
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
          onChange={e => setSeverity(e.target.value as IoCSeverity | '')}
          className="px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {(search || type || severity) && (
          <button
            onClick={() => { setSearch(''); setType(''); setSeverity('') }}
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
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">First Seen</th>
              <th className="px-4 py-3 font-medium">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-muted)]">
                  No IoCs match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map((ioc, i) => (
                <tr
                  key={ioc.id}
                  className={`border-b border-[var(--border)] hover:bg-[var(--bg-primary)] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold rounded border uppercase ${TYPE_COLORS[ioc.type]}`}>
                      {ioc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[220px]">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-[var(--text-primary)] truncate">{ioc.value}</span>
                      <CopyButton value={ioc.value} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ioc.severity}>
                      {ioc.severity.charAt(0).toUpperCase() + ioc.severity.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={ioc.riskScore} />
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{ioc.source}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">{formatDate(ioc.firstSeen)}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">{formatDate(ioc.lastSeen)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
