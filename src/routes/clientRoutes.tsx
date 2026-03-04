import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import RoleGuard from '@/guards/RoleGuard'
import ClientLayout from '@/layouts/ClientLayout'
import { ROLES } from '@/utils/constants'

const ClientDashboard      = lazy(() => import('@/pages/client/DashboardPage'))
const AlertsPage           = lazy(() => import('@/pages/client/AlertsPage'))
const AlertDetailPage      = lazy(() => import('@/pages/client/AlertDetailPage'))
const ClientIocsPage       = lazy(() => import('@/pages/client/IocsPage'))
const ClientReportsPage    = lazy(() => import('@/pages/client/ReportsPage'))
const RecommendationsPage  = lazy(() => import('@/pages/client/RecommendationsPage'))
const SettingsPage         = lazy(() => import('@/pages/shared/SettingsPage'))

/** Routes accessibles uniquement au Client */
export const clientRoutes: RouteObject[] = [
  {
    element: <RoleGuard allowedRoles={[ROLES.CLIENT]} />,
    children: [
      {
        element: <ClientLayout />,
        children: [
          { path: 'dashboard',       element: <ClientDashboard /> },
          { path: 'alerts',          element: <AlertsPage /> },
          { path: 'alerts/:id',      element: <AlertDetailPage /> },
          { path: 'iocs',            element: <ClientIocsPage /> },
          { path: 'reports',         element: <ClientReportsPage /> },
          { path: 'recommendations', element: <RecommendationsPage /> },
          { path: 'settings',        element: <SettingsPage /> },
        ],
      },
    ],
  },
]
