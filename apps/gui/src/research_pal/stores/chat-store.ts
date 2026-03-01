import { create } from 'zustand';
import { ChatMessage, SourceCitation } from '@/types/chat';
import apiClient from '@/lib/api-client';

interface ChatStore {
  messages: ChatMessage[];
  selectedPaperIds: string[];
  selectedDocumentIds: string[];
  isStreaming: boolean;
  isRecording: boolean;
  error: string | null;
  streamController: AbortController | null;
  setSelectedPapers: (ids: string[]) => void;
  setSelectedDocuments: (ids: string[]) => void;
  sendMessage: (content: string) => Promise<void>;
  appendStreamChunk: (messageId: string, chunk: string) => void;
  addCitation: (messageId: string, citation: SourceCitation) => void;
  clearChat: () => void;
  setRecording: (isRecording: boolean) => void;
  stopStreaming: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  selectedPaperIds: [],
  selectedDocumentIds: [],
  isStreaming: false,
  isRecording: false,
  error: null,
  streamController: null,

  setSelectedPapers: (ids: string[]) => {
    set({ selectedPaperIds: ids });
  },

  setSelectedDocuments: (ids: string[]) => {
    set({ selectedDocumentIds: ids });
  },

  sendMessage: async (content: string) => {
    const { isStreaming, selectedPaperIds, selectedDocumentIds } = get();

    // Prevent concurrent sends — a stream is already in flight
    if (isStreaming) return;

    if (!content.trim() || (selectedPaperIds.length === 0 && selectedDocumentIds.length === 0)) {
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    set({
      messages: [...get().messages, userMessage],
      isStreaming: true,
      error: null,
    });

    // Create assistant message placeholder
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      citations: [],
      createdAt: new Date().toISOString(),
    };

    set({
      messages: [...get().messages, assistantMessage],
    });

    try {
      // TODO: Replace with actual API streaming call
      // const controller = apiClient.streamChat(
      //   '/chat/stream',
      //   {
      //     paperIds: selectedPaperIds,
      //     documentIds: selectedDocumentIds,
      //     message: content,
      //   },
      //   {
      //     onChunk: (chunk) => get().appendStreamChunk(chunk),
      //     onCitation: (citation) => get().addCitation(citation),
      //     onDone: () => set({ isStreaming: false, streamController: null }),
      //     onError: (error) => set({ error, isStreaming: false, streamController: null }),
      //   }
      // );
      // set({ streamController: controller });

      // Mock streaming response
      const mockResponse = "Based on the papers you've selected, I can provide insights about the latest developments in machine learning. The transformer architecture has revolutionized natural language processing, enabling models to capture long-range dependencies more effectively than previous approaches.";

      const words = mockResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        get().appendStreamChunk(assistantMessage.id, words[i] + ' ');
      }

      // Add mock citation
      if (selectedPaperIds.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        get().addCitation(assistantMessage.id, {
          paperId: selectedPaperIds[0],
          paperTitle: 'Attention Is All You Need',
          section: 'Section 3',
        });
      }

      set({ isStreaming: false, streamController: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to send message',
        isStreaming: false,
        streamController: null,
      });
    }
  },

  appendStreamChunk: (messageId: string, chunk: string) => {
    set({
      messages: get().messages.map((m) =>
        m.id === messageId ? { ...m, content: m.content + chunk } : m
      ),
    });
  },

  addCitation: (messageId: string, citation: SourceCitation) => {
    set({
      messages: get().messages.map((m) =>
        m.id === messageId
          ? { ...m, citations: [...(m.citations || []), citation] }
          : m
      ),
    });
  },

  clearChat: () => {
    get().stopStreaming();
    set({
      messages: [],
      error: null,
    });
  },

  setRecording: (isRecording: boolean) => {
    set({ isRecording });
  },

  stopStreaming: () => {
    const { streamController } = get();
    if (streamController) {
      streamController.abort();
      set({ isStreaming: false, streamController: null });
    }
  },
}));
