export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low'
export type ThreatStatus = 'new' | 'in_review' | 'confirmed' | 'false_positive' | 'resolved'

/** Article / Feed de menace collecté */
export interface Threat {
  id: string
  title: string
  description: string
  source: string          // nom du feed (ex: "AlienVault OTX")
  sourceUrl?: string
  severity: ThreatSeverity
  riskScore: number       // 0-100
  status: ThreatStatus
  tags: string[]          // MITRE ATT&CK, secteur, etc.
  iocCount: number        // nombre d'IoC associés
  publishedAt: string     // ISO date
  collectedAt: string     // ISO date
  clientIds?: string[]    // clients concernés (admin only)
}

/** Résumé pour les listes */
export type ThreatSummary = Pick<
  Threat,
  'id' | 'title' | 'source' | 'severity' | 'riskScore' | 'status' | 'iocCount' | 'publishedAt'
>

/** Paramètres de filtrage des menaces */
export interface ThreatFilters {
  severity?: ThreatSeverity
  status?: ThreatStatus
  source?: string
  search?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}
