import { useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/PageHeader'

export default function IocDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div>
      <PageHeader title={`IoC #${id}`} subtitle="Analyse et historique de l'indicateur" />
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-muted)]">
        IoC Detail — à implémenter (Sprint 2)
      </div>
    </div>
  )
}
