import apiClient from './apiClient'

export interface Report {
  id: string
  name: string
  clientId?: string
  generatedBy: string
  period: { from: string; to: string }
  status: 'generating' | 'ready' | 'error'
  fileUrl?: string
  createdAt: string
}

const reportService = {
  getAll: () =>
    apiClient.get<Report[]>('/reports').then((r) => r.data),

  generate: (payload: { clientId?: string; from: string; to: string; name: string }) =>
    apiClient.post<Report>('/reports/generate', payload).then((r) => r.data),

  download: (id: string) =>
    apiClient.get(`/reports/${id}/download`, { responseType: 'blob' }),

  delete: (id: string) =>
    apiClient.delete(`/reports/${id}`),
}

export default reportService
