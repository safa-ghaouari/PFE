import apiClient from './apiClient'
import type { Client, ClientSummary, Alert, Recommendation } from '@/types/client.types'
import type { PaginatedResponse } from '@/types/client.types'

const clientService = {
  // ── Admin : gestion des clients ─────────────────────────────────────────
  getAll: () =>
    apiClient.get<ClientSummary[]>('/clients').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Client>(`/clients/${id}`).then((r) => r.data),

  create: (data: Partial<Client>) =>
    apiClient.post<Client>('/clients', data).then((r) => r.data),

  update: (id: string, data: Partial<Client>) =>
    apiClient.put<Client>(`/clients/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/clients/${id}`),

  // ── Client : ses propres alertes ────────────────────────────────────────
  getMyAlerts: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient
      .get<PaginatedResponse<Alert>>('/client/alerts', { params })
      .then((r) => r.data),

  getAlertById: (id: string) =>
    apiClient.get<Alert>(`/client/alerts/${id}`).then((r) => r.data),

  getRecommendations: () =>
    apiClient.get<Recommendation[]>('/client/recommendations').then((r) => r.data),

  markRecommendationDone: (id: string) =>
    apiClient.patch(`/client/recommendations/${id}`, { status: 'done' }),
}

export default clientService
