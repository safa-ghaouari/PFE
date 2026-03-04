import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

/** Map route → titre de page affiché dans la Topbar */
const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard':   'Dashboard',
  '/admin/clients':     'Client Management',
  '/admin/sources':     'CTI Sources',
  '/admin/threats':     'Threats',
  '/admin/iocs':        'Indicators of Compromise',
  '/admin/validation':  'IoC Validation',
  '/admin/correlation': 'Correlation Rules',
  '/admin/jobs':        'Jobs',
  '/admin/reports':     'Reports',
  '/admin/settings':    'Settings',
}

function getPageTitle(pathname: string): string {
  // Cherche la correspondance la plus précise
  const match = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key))
  return match ? PAGE_TITLES[match] : 'Threat Hunting Platform'
}

/**
 * Layout principal pour l'Admin MSSP.
 * Sidebar fixe à gauche + Topbar + contenu principal.
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <Sidebar collapsed={!sidebarOpen} />

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          title={title}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />

        {/* Zone de contenu scrollable */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
