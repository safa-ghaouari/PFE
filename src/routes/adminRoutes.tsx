import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import RoleGuard from '@/guards/RoleGuard'
import AdminLayout from '@/layouts/AdminLayout'
import { ROLES } from '@/utils/constants'

// Lazy loading des pages admin pour optimiser le bundle
const AdminDashboard    = lazy(() => import('@/pages/admin/DashboardPage'))
const ClientsPage       = lazy(() => import('@/pages/admin/ClientsPage'))
const ClientDetailPage  = lazy(() => import('@/pages/admin/ClientDetailPage'))
const SourcesPage       = lazy(() => import('@/pages/admin/SourcesPage'))
const ThreatsPage       = lazy(() => import('@/pages/admin/ThreatsPage'))
const ThreatDetailPage  = lazy(() => import('@/pages/admin/ThreatDetailPage'))
const IocsPage          = lazy(() => import('@/pages/admin/IocsPage'))
const IocDetailPage     = lazy(() => import('@/pages/admin/IocDetailPage'))
const JobsPage          = lazy(() => import('@/pages/admin/JobsPage'))
const CorrelationPage   = lazy(() => import('@/pages/admin/CorrelationPage'))
const ValidationPage    = lazy(() => import('@/pages/admin/ValidationPage'))
const AdminReportsPage  = lazy(() => import('@/pages/admin/ReportsPage'))
const SettingsPage      = lazy(() => import('@/pages/shared/SettingsPage'))

/** Routes accessibles uniquement à l'Admin MSSP — préfixées /admin/ */
export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: <RoleGuard allowedRoles={[ROLES.ADMIN]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'dashboard',           element: <AdminDashboard /> },
          { path: 'clients',             element: <ClientsPage /> },
          { path: 'clients/:id',         element: <ClientDetailPage /> },
          { path: 'sources',             element: <SourcesPage /> },
          { path: 'threats',             element: <ThreatsPage /> },
          { path: 'threats/:id',         element: <ThreatDetailPage /> },
          { path: 'iocs',                element: <IocsPage /> },
          { path: 'iocs/:id',            element: <IocDetailPage /> },
          { path: 'jobs',                element: <JobsPage /> },
          { path: 'correlation',         element: <CorrelationPage /> },
          { path: 'validation',          element: <ValidationPage /> },
          { path: 'reports',             element: <AdminReportsPage /> },
          { path: 'settings',            element: <SettingsPage /> },
        ],
      },
    ],
  },
]
