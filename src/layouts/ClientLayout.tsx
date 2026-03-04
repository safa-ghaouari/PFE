import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':       'My Dashboard',
  '/alerts':          'My Alerts',
  '/iocs':            'Indicators of Compromise',
  '/reports':         'My Reports',
  '/recommendations': 'Recommendations',
  '/settings':        'Settings',
}

function getPageTitle(pathname: string): string {
  const match = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key))
  return match ? PAGE_TITLES[match] : 'Threat Hunting Platform'
}

/**
 * Layout principal pour le Client.
 * Identique à AdminLayout mais la Sidebar affiche la nav client.
 */
export default function ClientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar collapsed={!sidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          title={title}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
