import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser } from '@/types/auth.types'
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/utils/constants'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  // Actions
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void
  setAccessToken: (token: string) => void
  logout: () => void
}

/**
 * Store Zustand pour l'authentification.
 * Persiste uniquement refreshToken dans sessionStorage (sécurité).
 * L'accessToken est gardé en mémoire (state) uniquement.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        // Stockage du refreshToken dans sessionStorage via le middleware persist
        set({ user, accessToken, refreshToken, isAuthenticated: true })
      },

      setAccessToken: (token) => {
        set({ accessToken: token })
      },

      logout: () => {
        sessionStorage.removeItem(TOKEN_KEY)
        sessionStorage.removeItem(REFRESH_TOKEN_KEY)
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },
    }),
    {
      name: 'th-auth',                          // clé dans sessionStorage
      storage: createJSONStorage(() => sessionStorage),
      // On ne persiste que refreshToken et user (pas l'accessToken)
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

/** Hook utilitaire pour accéder au rôle courant */
export const useRole = () => useAuthStore((s) => s.user?.role)
