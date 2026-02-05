import { useChatStore } from '@/stores/chat-store';

export function useChat() {
  const {
    messages,
    selectedPaperIds,
    selectedDocumentIds,
    isStreaming,
    error,
    setSelectedPapers,
    setSelectedDocuments,
    sendMessage,
    clearChat,
    stopStreaming,
  } = useChatStore();

  return {
    messages,
    selectedPaperIds,
    selectedDocumentIds,
    isStreaming,
    error,
    setSelectedPapers,
    setSelectedDocuments,
    sendMessage,
    clearChat,
    stopStreaming,
  };
}
