import { PageHeader } from '@/components/layout/PageHeader'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile and preferences" />
      <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center text-sm text-[var(--text-muted)]">
        <Settings className="mx-auto mb-3 h-8 w-8 opacity-30" />
        Settings — coming in Sprint 2
      </div>
    </div>
  )
}
