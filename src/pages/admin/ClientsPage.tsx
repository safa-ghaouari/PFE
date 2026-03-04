import { PageHeader } from '@/components/layout/PageHeader'
import { Users } from 'lucide-react'

export default function ClientsPage() {
  return (
    <div>
      <PageHeader title="Client Management" subtitle="Manage your MSSP clients" />
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-muted)]">
        <Users className="mx-auto mb-3 h-8 w-8 opacity-30" />
        Clients — coming in Sprint 2
      </div>
    </div>
  )
}
