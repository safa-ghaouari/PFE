import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Check, X, Copy, Check as CheckIcon, MessageSquare } from 'lucide-react'
import type { IoCType } from '@/utils/constants'
import type { IoCSeverity } from '@/types/ioc.types'

// ── Types ─────────────────────────────────────────────────────────────────────
interface PendingIoC {
  id: string
  type: IoCType
  value: string
  severity: IoCSeverity
  riskScore: number
  source: string
  detectedAt: string
  context: string   // brief context why it was flagged
}

type ValidationState = 'pending' | 'validated' | 'rejected'

interface IoCDecision {
  state: ValidationState
  notes: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const INITIAL_QUEUE: PendingIoC[] = [
  {
    id: 'v1', type: 'ip', value: '103.76.228.25', severity: 'critical', riskScore: 86,
    source: 'CERT-FR', detectedAt: '2026-03-04T00:00:00Z',
    context: 'Observed in C2 traffic from BlackCat ransomware campaign. Multiple beaconing events to this IP in the last 24h.',
  },
  {
    id: 'v2', type: 'url', value: 'http://malicious.tk/payload.exe', severity: 'critical', riskScore: 81,
    source: 'MISP Community', detectedAt: '2026-03-04T01:00:00Z',
    context: 'URL distributing a PE executable identified as Cobalt Strike beacon dropper.',
  },
  {
    id: 'v3', type: 'email', value: 'cfo-impersonator@secure-bank.net', severity: 'high', riskScore: 65,
    source: 'CERT-FR', detectedAt: '2026-03-03T09:00:00Z',
    context: 'BEC campaign sender impersonating CFO of major financial institution to request wire transfers.',
  },
  {
    id: 'v4', type: 'hash', value: 'da39a3ee5e6b4b0d3255bfef95601890', severity: 'medium', riskScore: 55,
    source: 'MISP Community', detectedAt: '2026-02-28T12:00:00Z',
    context: 'MD5 hash found in supply chain attack on npm package "color-convert-pro". Suspicious DLL injection.',
  },
  {
    id: 'v5', type: 'hash', value: '5f4dcc3b5aa765d61d8327deb882cf99', severity: 'medium', riskScore: 48,
    source: 'MISP Community', detectedAt: '2026-02-25T11:00:00Z',
    context: 'File hash linked to GootLoader payload. Multiple AV verdicts: trojan.gootloader.gen.',
  },
  {
    id: 'v6', type: 'email', value: 'invoice-noreply@docusign-fake.co', severity: 'high', riskScore: 74,
    source: 'CERT-FR', detectedAt: '2026-03-03T15:00:00Z',
    context: 'Phishing campaign impersonating DocuSign. Email delivers macro-laced DOCX with Emotet dropper.',
  },
  {
    id: 'v7', type: 'ip', value: '5.188.86.172', severity: 'high', riskScore: 71,
    source: 'AlienVault OTX', detectedAt: '2026-03-03T18:00:00Z',
    context: 'Tor exit node used in SSH brute-force campaign against exposed Linux servers. 3 client tenants affected.',
  },
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
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// ── CopyButton ────────────────────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
    >
      {copied ? <CheckIcon className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ValidationPage() {
  // Track decision state per IoC: undefined = no decision yet
  const [decisions, setDecisions] = useState<Record<string, IoCDecision>>({})
  const [notesOpen, setNotesOpen] = useState<string | null>(null)
  const [notesDraft, setNotesDraft] = useState('')

  function decide(id: string, state: 'validated' | 'rejected') {
    setDecisions(prev => ({
      ...prev,
      [id]: { state, notes: prev[id]?.notes ?? '' },
    }))
  }

  function openNotes(id: string) {
    setNotesDraft(decisions[id]?.notes ?? '')
    setNotesOpen(id)
  }

  function saveNotes(id: string) {
    setDecisions(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? { state: 'pending' as ValidationState }), notes: notesDraft },
    }))
    setNotesOpen(null)
  }

  const pending   = INITIAL_QUEUE.filter(ioc => !decisions[ioc.id] || decisions[ioc.id].state === 'pending')
  const validated = INITIAL_QUEUE.filter(ioc => decisions[ioc.id]?.state === 'validated')
  const rejected  = INITIAL_QUEUE.filter(ioc => decisions[ioc.id]?.state === 'rejected')

  return (
    <div className="space-y-6">
      <PageHeader
        title="IoC Validation"
        subtitle={`${pending.length} pending · ${validated.length} validated · ${rejected.length} rejected`}
      />

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', count: pending.length,   color: 'text-yellow-400' },
          { label: 'Validated',      count: validated.length, color: 'text-green-400'  },
          { label: 'Rejected',       count: rejected.length,  color: 'text-red-400'    },
        ].map(s => (
          <div key={s.label} className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Queue ── */}
      <div className="space-y-3">
        {INITIAL_QUEUE.map(ioc => {
          const decision = decisions[ioc.id]
          const state: ValidationState = decision?.state ?? 'pending'
          const hasNotes = !!decision?.notes

          return (
            <div
              key={ioc.id}
              className={`rounded border bg-[var(--bg-secondary)] transition-opacity ${
                state !== 'pending' ? 'opacity-50' : 'border-[var(--border)]'
              } ${state === 'validated' ? 'border-green-500/30' : state === 'rejected' ? 'border-red-500/30' : 'border-[var(--border)]'}`}
            >
              <div className="p-4 flex items-start gap-4">
                {/* Left: type + value */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold rounded border uppercase ${TYPE_COLORS[ioc.type]}`}>
                      {ioc.type}
                    </span>
                    <Badge variant={ioc.severity}>
                      {ioc.severity.charAt(0).toUpperCase() + ioc.severity.slice(1)}
                    </Badge>
                    <span className="text-xs text-[var(--text-muted)]">Risk: <strong className="text-[var(--text-primary)]">{ioc.riskScore}</strong></span>
                    <span className="text-xs text-[var(--text-muted)]">·</span>
                    <span className="text-xs text-[var(--text-muted)]">{ioc.source}</span>
                    <span className="text-xs text-[var(--text-muted)]">·</span>
                    <span className="text-xs text-[var(--text-muted)]">{formatDate(ioc.detectedAt)}</span>
                  </div>

                  {/* Value */}
                  <div className="flex items-center gap-2 mb-3">
                    <code className="font-mono text-sm text-[var(--accent-cyan)] break-all">
                      {ioc.value}
                    </code>
                    <CopyButton value={ioc.value} />
                  </div>

                  {/* Context */}
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{ioc.context}</p>

                  {/* Notes preview */}
                  {hasNotes && (
                    <div className="mt-2 text-xs text-[var(--text-muted)] italic">
                      Note: {decision!.notes}
                    </div>
                  )}
                </div>

                {/* Right: action buttons */}
                <div className="flex flex-col gap-2 shrink-0">
                  {state === 'pending' ? (
                    <>
                      <button
                        onClick={() => decide(ioc.id, 'validated')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" /> Validate
                      </button>
                      <button
                        onClick={() => decide(ioc.id, 'rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => openNotes(ioc.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-[var(--text-muted)] border border-[var(--border)] hover:bg-white/5 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Notes
                      </button>
                    </>
                  ) : (
                    <>
                      <span className={`text-xs font-semibold ${state === 'validated' ? 'text-green-400' : 'text-red-400'}`}>
                        {state === 'validated' ? '✓ Validated' : '✗ Rejected'}
                      </span>
                      <button
                        onClick={() => setDecisions(prev => { const next = { ...prev }; delete next[ioc.id]; return next })}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors underline"
                      >
                        Undo
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Notes panel */}
              {notesOpen === ioc.id && (
                <div className="border-t border-[var(--border)] p-4">
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5">Analyst Notes</label>
                  <textarea
                    rows={3}
                    value={notesDraft}
                    onChange={e => setNotesDraft(e.target.value)}
                    placeholder="Add context, reference CVE, explain decision…"
                    className="w-full px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] resize-none"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => saveNotes(ioc.id)}
                      className="px-3 py-1 text-xs rounded bg-[var(--accent-cyan)] text-black font-semibold hover:opacity-90 transition-opacity"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setNotesOpen(null)}
                      className="px-3 py-1 text-xs rounded border border-[var(--border)] text-[var(--text-muted)] hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {INITIAL_QUEUE.length === 0 && (
        <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-12 text-center text-sm text-[var(--text-muted)]">
          All IoCs have been reviewed. Queue is empty.
        </div>
      )}
    </div>
  )
}
