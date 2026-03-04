import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div>
      <PageHeader title={`Client #${id}`} subtitle="Détail du client" />
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-muted)]">
        Détail Client — à implémenter (Sprint 2)
      </div>
    </div>
  )
}
