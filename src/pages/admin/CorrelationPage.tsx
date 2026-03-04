import { PageHeader } from '@/components/layout/PageHeader'
import { GitMerge } from 'lucide-react'

export default function CorrelationPage() {
  return (
    <div>
      <PageHeader title="Règles de Corrélation" subtitle="Créez et gérez vos règles de détection" />
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-muted)]">
        <GitMerge className="mx-auto mb-3 h-8 w-8 opacity-30" />
        Correlation Rules Editor — à implémenter (Sprint 2)
      </div>
    </div>
  )
}
