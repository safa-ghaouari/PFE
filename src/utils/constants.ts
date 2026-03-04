/** Durée du token d'accès en ms (15 min) */
export const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000

/** Clé de stockage du token dans sessionStorage */
export const TOKEN_KEY = 'th_access_token'
export const REFRESH_TOKEN_KEY = 'th_refresh_token'

/** Rôles disponibles */
export const ROLES = {
  ADMIN: 'admin_mssp',
  CLIENT: 'client',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

/** Couleurs de sévérité (utilisées dans les charts) */
export const SEVERITY_COLORS = {
  critical: '#FF4444',
  high:     '#FF8C00',
  medium:   '#FFD700',
  low:      '#00C853',
} as const

/** Severity labels */
export const SEVERITY_LABELS = {
  critical: 'Critical',
  high:     'High',
  medium:   'Medium',
  low:      'Low',
} as const

/** Types d'IoC supportés */
export const IOC_TYPES = ['ip', 'domain', 'hash', 'url', 'email'] as const
export type IoCType = (typeof IOC_TYPES)[number]
