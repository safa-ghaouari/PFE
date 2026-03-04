import { useAuthStore } from '@/store/authStore'
import authService from '@/services/api/authService'
import type { LoginCredentials, AuthUser } from '@/types/auth.types'
import { ROLES } from '@/utils/constants'

// ── Comptes de démo (contournent l'API si le backend est absent) ─────────────
// Supprimez ce bloc quand le vrai backend est connecté.
const DEMO_ACCOUNTS: Record<string, { password: string; user: AuthUser; token: string }> = import.meta.env.DEV ? {
  'admin@mssp.com': { 
    password: 'admin123',
    token: 'demo-access-token-admin',
    user: { id: '1', email: 'admin@mssp.com', name: 'Admin MSSP', role: ROLES.ADMIN },
  },
  'client@demo.com': {
    password: 'client123',
    token: 'demo-access-token-client',
    user: { id: '2', email: 'client@demo.com', name: 'Client Demo', role: ROLES.CLIENT, clientId: 'c1' },
  },
} : {}

/**
 * Hook principal pour l'authentification.
 * Expose les données utilisateur et les actions auth.
 */
export function useAuth() {
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore()

  const login = async (credentials: LoginCredentials) => {
    // Mode démo : si le compte existe en local, on simule la réponse
    if (import.meta.env.DEV) {
      const demo = DEMO_ACCOUNTS[credentials.email]
      if (demo && demo.password === credentials.password) {
        setAuth(demo.user, demo.token, `${demo.token}-refresh`)
        return demo.user
      }
    }

    // Sinon appel API réel
    const data = await authService.login(credentials)
    setAuth(data.user, data.accessToken, data.refreshToken)
    return data.user
  }

  const logout = async () => {
    const refreshToken = useAuthStore.getState().refreshToken
    if (refreshToken) {
      // On notifie le backend (on ignore l'erreur si le backend est down)
      await authService.logout(refreshToken).catch(() => {})
    }
    storeLogout()
  }

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === ROLES.ADMIN,
    isClient: user?.role === ROLES.CLIENT,
    login,
    logout,
  }
}
