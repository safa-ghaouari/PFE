import type { Role } from '@/utils/constants'

/** Payload du token JWT décodé */
export interface JWTPayload {
  sub: string        // user id
  email: string
  role: Role
  clientId?: string  // présent uniquement pour le rôle client
  exp: number
  iat: number
}

/** Utilisateur authentifié en mémoire */
export interface AuthUser {
  id: string
  email: string
  name: string
  role: Role
  clientId?: string
  avatar?: string
}

/** Réponse du backend sur /auth/login */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

/** Corps de la requête de login */
export interface LoginCredentials {
  email: string
  password: string
}
