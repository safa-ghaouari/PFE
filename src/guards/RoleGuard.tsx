import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import type { Role } from '@/utils/constants'

interface RoleGuardProps {
  /** Rôles autorisés à accéder à cette section */
  allowedRoles: Role[]
}

/**
 * Protège les routes en fonction du rôle de l'utilisateur.
 * Si le rôle ne correspond pas, redirige vers /dashboard.
 * Doit être utilisé à l'intérieur d'un <ProtectedRoute>.
 */
export default function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to / so RoleRedirect picks the correct dashboard per role
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
