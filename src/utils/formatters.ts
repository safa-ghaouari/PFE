/** Formate une date ISO en format lisible */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Formate une date + heure */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Retourne le niveau de sévérité selon un score 0-100 */
export function scoreToSeverity(score: number): 'critical' | 'high' | 'medium' | 'low' {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

/** Tronque une valeur IoC longue (hash, URL) */
export function truncateIoC(value: string, maxLen = 40): string {
  if (value.length <= maxLen) return value
  return `${value.slice(0, 18)}…${value.slice(-10)}`
}

/** Formate un nombre avec séparateur de milliers */
export function formatNumber(n: number): string {
  return n.toLocaleString('fr-FR')
}
