import { create } from 'zustand';
import { Paper, PaperFilters } from '@/types/paper';
import apiClient from '@/lib/api-client';

interface PaperStore {
  papers: Paper[];
  isLoading: boolean;
  error: string | null;
  fetchPapers: (filters?: PaperFilters) => Promise<void>;
  fetchRecentPapers: (limit: number) => Promise<void>;
}

export const usePaperStore = create<PaperStore>((set) => ({
  papers: [],
  isLoading: false,
  error: null,

  fetchPapers: async (filters?: PaperFilters) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.get<PaginatedResponse<Paper>>('/papers', filters);
      // set({ papers: response.data, isLoading: false });

      // Mock data for MVP
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockPapers: Paper[] = [
        {
          id: '1',
          arxivId: '2301.00001',
          title: 'Attention Is All You Need: A Comprehensive Survey',
          authors: ['John Doe', 'Jane Smith'],
          abstract: 'This paper presents a comprehensive survey of transformer architectures...',
          publishedDate: '2023-01-15T00:00:00Z',
          categories: ['cs.AI', 'cs.LG'],
          pdfUrl: 'https://arxiv.org/pdf/2301.00001',
          sourceTopicId: 'topic-1',
          curatedAt: '2023-01-16T00:00:00Z',
          relevanceScore: 0.95,
        },
        {
          id: '2',
          arxivId: '2301.00002',
          title: 'Large Language Models in Practice',
          authors: ['Alice Johnson'],
          abstract: 'An exploration of practical applications of large language models...',
          publishedDate: '2023-01-20T00:00:00Z',
          categories: ['cs.CL'],
          pdfUrl: 'https://arxiv.org/pdf/2301.00002',
          sourceTopicId: 'topic-1',
          curatedAt: '2023-01-21T00:00:00Z',
          relevanceScore: 0.88,
        },
      ];
      set({ papers: mockPapers, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch papers',
        isLoading: false,
      });
    }
  },

  fetchRecentPapers: async (limit: number) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get<ApiResponse<Paper[]>>('/dashboard/recent-papers', { limit });
      // set({ papers: response.data, isLoading: false });

      // Mock data for MVP
      await new Promise((resolve) => setTimeout(resolve, 300));
      const mockPapers: Paper[] = [
        {
          id: '1',
          arxivId: '2301.00001',
          title: 'Attention Is All You Need: A Comprehensive Survey',
          authors: ['John Doe', 'Jane Smith'],
          abstract: 'This paper presents a comprehensive survey...',
          publishedDate: '2023-01-15T00:00:00Z',
          categories: ['cs.AI'],
          pdfUrl: 'https://arxiv.org/pdf/2301.00001',
          sourceTopicId: 'topic-1',
          curatedAt: '2023-01-16T00:00:00Z',
          relevanceScore: 0.95,
        },
      ].slice(0, limit);
      set({ papers: mockPapers, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch recent papers',
        isLoading: false,
      });
    }
  },
}));
