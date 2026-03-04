import { useState } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

/**
 * Hook utilitaire pour gérer la pagination côté frontend.
 */
export function usePagination({ initialPage = 1, initialLimit = 20 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const goToPage = (p: number) => setPage(p)
  const nextPage = () => setPage((p) => p + 1)
  const prevPage = () => setPage((p) => Math.max(1, p - 1))
  const reset = () => setPage(1)

  return { page, limit, setPage: goToPage, nextPage, prevPage, setLimit, reset }
}
