import apiClient from './apiClient'
import type { LoginCredentials, LoginResponse } from '@/types/auth.types'

const authService = {
  /** Connexion — retourne tokens + user */
  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>('/auth/login', credentials).then((r) => r.data),

  /** Déconnexion — invalide le refresh token côté serveur */
  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refreshToken }),

  /** Rafraîchit l'access token */
  refresh: (refreshToken: string) =>
    apiClient
      .post<{ accessToken: string }>('/auth/refresh', { refreshToken })
      .then((r) => r.data),

  /** Récupère le profil utilisateur courant */
  me: () =>
    apiClient.get('/auth/me').then((r) => r.data),
}

export default authService
