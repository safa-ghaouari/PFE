import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'

export default function ThreatDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div>
      <PageHeader title={`Menace #${id}`} subtitle="Analyse détaillée de la menace" />
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-muted)]">
        Threat Detail — à implémenter (Sprint 2)
      </div>
    </div>
  )
}
