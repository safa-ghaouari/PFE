import apiClient from './apiClient'
import type { Threat, ThreatSummary, ThreatFilters } from '@/types/threat.types'
import type { PaginatedResponse } from '@/types/client.types'

const threatService = {
  /** Liste paginée des menaces avec filtres */
  getAll: (filters?: ThreatFilters) =>
    apiClient
      .get<PaginatedResponse<ThreatSummary>>('/threats', { params: filters })
      .then((r) => r.data),

  /** Détail d'une menace */
  getById: (id: string) =>
    apiClient.get<Threat>(`/threats/${id}`).then((r) => r.data),

  /** Statistiques pour le dashboard */
  getStats: () =>
    apiClient.get('/threats/stats').then((r) => r.data),
}

export default threatService
