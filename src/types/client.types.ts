export type ClientStatus = 'active' | 'inactive' | 'suspended'

/** Client géré par l'Admin MSSP */
export interface Client {
  id: string
  name: string
  email: string
  contactName: string
  status: ClientStatus
  sector: string          // ex: "Finance", "Santé"
  activeAlertsCount: number
  criticalIoCCount: number
  globalRiskScore: number // 0-100
  createdAt: string
  updatedAt: string
}

/** Résumé client pour les listes */
export type ClientSummary = Pick<
  Client,
  'id' | 'name' | 'contactName' | 'status' | 'globalRiskScore' | 'activeAlertsCount'
>

/** Alerte visible par le client */
export interface Alert {
  id: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'closed'
  threatId?: string
  iocIds: string[]
  createdAt: string
  updatedAt: string
  recommendation?: string
}

/** Recommandation pour le client */
export interface Recommendation {
  id: string
  title: string
  description: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'done'
  relatedAlertId?: string
  createdAt: string
}

/** Réponse paginée générique */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
