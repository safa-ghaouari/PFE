import apiClient from './apiClient'
import type { IoC, IocSummary, IoCFilters } from '@/types/ioc.types'
import type { PaginatedResponse } from '@/types/client.types'

const iocService = {
  /** Liste paginée des IoC */
  getAll: (filters?: IoCFilters) =>
    apiClient
      .get<PaginatedResponse<IocSummary>>('/iocs', { params: filters })
      .then((r) => r.data),

  /** Détail d'un IoC */
  getById: (id: string) =>
    apiClient.get<IoC>(`/iocs/${id}`).then((r) => r.data),

  /** Valide ou rejette un IoC (admin) */
  validate: (id: string, payload: { status: 'validated' | 'rejected'; notes?: string }) =>
    apiClient.patch<IoC>(`/iocs/${id}/validate`, payload).then((r) => r.data),

  /** IoC en attente de validation */
  getPending: () =>
    apiClient.get<IocSummary[]>('/iocs/pending').then((r) => r.data),

  /** Exporte les IoC en CSV */
  exportCsv: (filters?: IoCFilters) =>
    apiClient.get('/iocs/export', {
      params: filters,
      responseType: 'blob',
    }),
}

export default iocService
