import { Outlet } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

/**
 * Centered auth layout with ambient animated background.
 * The actual form card is rendered by <Outlet />.
 */
export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] px-4 py-10 overflow-hidden">

      {/* ── Ambient glow orbs (purely decorative) ── */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,217,255,0.08) 0%, transparent 70%)',
          animation: 'pulse 6s ease-in-out infinite',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(31,111,235,0.07) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite 2s',
        }}
      />

      {/* ── Brand header ── */}
      <div className="mb-7 flex flex-col items-center gap-3 text-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{
            background: 'rgba(0,217,255,0.08)',
            borderColor: 'rgba(0,217,255,0.25)',
            boxShadow: '0 0 24px rgba(0,217,255,0.12)',
          }}
        >
          <ShieldCheck className="h-7 w-7 text-[var(--accent-cyan)]" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
            ThreatHunting<span className="text-[var(--accent-cyan)]">Platform</span>
          </h1>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">Automated Threat Intelligence</p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div
        className="relative w-full max-w-[400px] rounded-2xl border"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
        }}
      >
        <Outlet />
      </div>

      {/* ── Footer ── */}
      <p className="mt-6 text-[10px] text-[var(--text-muted)]">
        © {new Date().getFullYear()} MSSP Platform — Confidential
      </p>
    </div>
  )
}
