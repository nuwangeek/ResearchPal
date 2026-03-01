import { create } from 'zustand';
import { Topic, TopicFormData } from '@/types/topic';
import apiClient from '@/lib/api-client';

interface TopicStore {
  topics: Topic[];
  isLoading: boolean;
  error: string | null;
  fetchTopics: () => Promise<void>;
  createTopic: (data: TopicFormData) => Promise<void>;
  updateTopic: (id: string, data: Partial<TopicFormData>) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  toggleTopic: (id: string, enabled: boolean) => Promise<void>;
}

export const useTopicStore = create<TopicStore>((set, get) => ({
  topics: [],
  isLoading: false,
  error: null,

  fetchTopics: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get<PaginatedResponse<Topic>>('/topics');
      // set({ topics: response.data, isLoading: false });

      // Mock data for MVP
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockTopics: Topic[] = [
        {
          id: 'topic-1',
          name: 'Machine Learning',
          keywords: ['deep learning', 'neural networks', 'transformers'],
          frequency: 'daily',
          timeWindow: '7d',
          startDate: '2024-01-01T00:00:00Z',
          enabled: true,
          status: 'active',
          lastRunAt: new Date().toISOString(),
          paperCount: 45,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'topic-2',
          name: 'Natural Language Processing',
          keywords: ['NLP', 'language models', 'text generation'],
          frequency: 'every_3_days',
          timeWindow: '14d',
          startDate: '2024-01-15T00:00:00Z',
          enabled: false,
          status: 'paused',
          lastRunAt: '2024-02-01T00:00:00Z',
          paperCount: 23,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z',
        },
      ];
      set({ topics: mockTopics, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch topics',
        isLoading: false,
      });
    }
  },

  createTopic: async (data: TopicFormData) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.post<ApiResponse<Topic>>('/topics', data);
      // set({ topics: [...get().topics, response.data], isLoading: false });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newTopic: Topic = {
        id: `topic-${Date.now()}`,
        ...data,
        status: data.enabled ? 'active' : 'paused',
        paperCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set({ topics: [...get().topics, newTopic], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create topic',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTopic: async (id: string, data: Partial<TopicFormData>) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // await apiClient.put<ApiResponse<Topic>>(`/topics/${id}`, data);

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({
        topics: get().topics.map((topic) =>
          topic.id === id
            ? { ...topic, ...data, updatedAt: new Date().toISOString() }
            : topic
        ),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update topic',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTopic: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // await apiClient.delete(`/topics/${id}`);

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({
        topics: get().topics.filter((topic) => topic.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete topic',
        isLoading: false,
      });
      throw error;
    }
  },

  toggleTopic: async (id: string, enabled: boolean) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // await apiClient.patch<ApiResponse<Topic>>(`/topics/${id}/toggle`, { enabled });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({
        topics: get().topics.map((topic) =>
          topic.id === id
            ? {
                ...topic,
                enabled,
                status: enabled ? 'active' : 'paused',
                updatedAt: new Date().toISOString(),
              }
            : topic
        ),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to toggle topic',
        isLoading: false,
      });
      throw error;
    }
  },
}));
