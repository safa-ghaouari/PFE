import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'

export default function AlertDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div>
      <PageHeader title={`Alerte #${id}`} subtitle="Détail et recommandation" />
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-muted)]">
        Alert Detail — à implémenter (Sprint 2)
      </div>
    </div>
  )
}
