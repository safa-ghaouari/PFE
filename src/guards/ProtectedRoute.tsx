import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

/**
 * Protège les routes qui nécessitent une authentification.
 * Redirige vers /login si l'utilisateur n'est pas connecté.
 * Conserve la route cible dans `state.from` pour rediriger après login.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
