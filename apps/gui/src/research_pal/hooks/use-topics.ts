import { useEffect } from 'react';
import { useTopicStore } from '@/stores/topic-store';

export function useTopics() {
  const {
    topics,
    isLoading,
    error,
    fetchTopics,
    createTopic,
    updateTopic,
    deleteTopic,
    toggleTopic,
  } = useTopicStore();

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return {
    topics,
    isLoading,
    error,
    createTopic,
    updateTopic,
    deleteTopic,
    toggleTopic,
    refetch: fetchTopics,
  };
}
