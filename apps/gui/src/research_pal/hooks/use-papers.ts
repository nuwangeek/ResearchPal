import { useEffect } from 'react';
import { usePaperStore } from '@/stores/paper-store';
import { PaperFilters } from '@/types/paper';

export function usePapers(filters?: PaperFilters) {
  const { papers, isLoading, error, fetchPapers } = usePaperStore();

  useEffect(() => {
    fetchPapers(filters);
  }, [fetchPapers, filters]);

  return { papers, isLoading, error, refetch: () => fetchPapers(filters) };
}

export function useRecentPapers(limit: number = 5) {
  const { papers, isLoading, error, fetchRecentPapers } = usePaperStore();

  useEffect(() => {
    fetchRecentPapers(limit);
  }, [fetchRecentPapers, limit]);

  return { papers, isLoading, error, refetch: () => fetchRecentPapers(limit) };
}
