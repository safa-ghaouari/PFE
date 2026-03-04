import { PageHeader } from '@/components/layout/PageHeader'
import { Globe } from 'lucide-react'

export default function SourcesPage() {
  return (
    <div>
      <PageHeader title="CTI Sources" subtitle="Manage your Threat Intelligence feeds" />
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-muted)]">
        <Globe className="mx-auto mb-3 h-8 w-8 opacity-30" />
        CTI Sources — coming in Sprint 2
      </div>
    </div>
  )
}
