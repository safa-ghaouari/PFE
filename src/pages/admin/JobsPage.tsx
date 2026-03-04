import { PageHeader } from '@/components/layout/PageHeader'
import { Cpu } from 'lucide-react'

export default function JobsPage() {
  return (
    <div>
      <PageHeader title="Jobs" subtitle="Collecte, corrélation, enrichissement" />
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-muted)]">
        <Cpu className="mx-auto mb-3 h-8 w-8 opacity-30" />
        Jobs Monitor — à implémenter (Sprint 2)
      </div>
    </div>
  )
}
