import { useEffect } from 'react';
import { useDocumentStore } from '@/stores/document-store';

export function useDocuments() {
  const {
    documents,
    uploads,
    isLoading,
    error,
    fetchDocuments,
    uploadFiles,
    deleteDocument,
  } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    uploads,
    isLoading,
    error,
    uploadFiles,
    deleteDocument,
    refetch: fetchDocuments,
  };
}
