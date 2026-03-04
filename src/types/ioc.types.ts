import type { IoCType } from '@/utils/constants'

export type IoCStatus = 'pending' | 'validated' | 'rejected' | 'expired'
export type IoCSeverity = 'critical' | 'high' | 'medium' | 'low'

/** Indicateur de Compromission */
export interface IoC {
  id: string
  type: IoCType
  value: string           // ex: "192.168.1.1", "malware.exe", "abc123..."
  riskScore: number       // 0-100
  severity: IoCSeverity
  status: IoCStatus
  confidence: number      // 0-100 (confiance dans la donnée)
  source: string
  threatIds: string[]     // menaces associées
  tags: string[]
  firstSeen: string       // ISO date
  lastSeen: string        // ISO date
  validatedBy?: string    // email de l'analyste ayant validé
  validatedAt?: string
  notes?: string
  clientIds?: string[]    // clients concernés (admin only)
}

/** Résumé IoC pour listes */
export type IocSummary = Pick<
  IoC,
  'id' | 'type' | 'value' | 'riskScore' | 'severity' | 'status' | 'source' | 'lastSeen'
>

/** Filtres pour la page IoC */
export interface IoCFilters {
  type?: IoCType
  severity?: IoCSeverity
  status?: IoCStatus
  search?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}
