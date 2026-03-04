import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/guards/ProtectedRoute'
import LoginPage from '@/pages/auth/LoginPage'
import { adminRoutes } from './adminRoutes'
import { clientRoutes } from './clientRoutes'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/store/authStore'

/** Fallback affiché pendant le lazy loading des pages */
function PageFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
      <Spinner size="lg" />
    </div>
  )
}

/** Redirige vers le dashboard approprié selon le rôle */
function RoleRedirect() {
  const user = useAuthStore((s) => s.user)
  if (user?.role === 'admin_mssp') return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/dashboard" replace />
}

const router = createBrowserRouter([
  // ── Routes publiques (auth) ──────────────────────────────────────────────
  {
    path: '/login', element: <LoginPage />
  },

  // ── Routes protégées (auth requise) ─────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/',  element: <RoleRedirect /> },
      ...adminRoutes,
      ...clientRoutes,
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/" replace /> },
])

/**
 * Point d'entrée du routeur.
 * Suspense gère le fallback pendant le lazy loading (remplace fallbackElement supprimé en RR v7).
 */
export default function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
