'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TopBar } from '@/components/layout/top-bar';
import { Button } from '@/components/ui/button';
import { PaperSelector } from '@/components/chat/paper-selector';
import { MessageList } from '@/components/chat/message-list';
import { ChatInput } from '@/components/chat/chat-input';
import { useChat } from '@/hooks/use-chat';
import { usePapers } from '@/hooks/use-papers';
import { useDocuments } from '@/hooks/use-documents';
import { Trash2 } from 'lucide-react';

function ChatContent() {
  const searchParams = useSearchParams();
  const paperId = searchParams.get('paperId');
  const documentId = searchParams.get('documentId');

  const {
    messages,
    selectedPaperIds,
    selectedDocumentIds,
    isStreaming,
    setSelectedPapers,
    setSelectedDocuments,
    sendMessage,
    clearChat,
  } = useChat();

  const { papers } = usePapers();
  const { documents } = useDocuments();

  // Pre-select paper/document from URL
  useEffect(() => {
    if (paperId && papers.some((p) => p.id === paperId)) {
      setSelectedPapers([paperId]);
    }
    if (documentId && documents.some((d) => d.id === documentId)) {
      setSelectedDocuments([documentId]);
    }
  }, [paperId, documentId, papers, documents, setSelectedPapers, setSelectedDocuments]);

  const handleSelectionChange = (ids: string[]) => {
    // Split IDs into papers and documents
    const paperIds = ids.filter((id) => papers.some((p) => p.id === id));
    const docIds = ids.filter((id) => documents.some((d) => d.id === id));

    setSelectedPapers(paperIds);
    setSelectedDocuments(docIds);
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      clearChat();
    }
  };

  const allSelectedIds = [...selectedPaperIds, ...selectedDocumentIds];

  return (
    <>
      <TopBar
        title="Chat"
        actions={
          messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClearChat}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chat
            </Button>
          )
        }
      />

      <div className="mt-6 flex gap-6" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Paper Selector - Left Panel */}
        <div className="w-80 shrink-0">
          <PaperSelector
            papers={papers}
            documents={documents}
            selectedIds={allSelectedIds}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        {/* Chat Area - Right Panel */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <MessageList messages={messages} isStreaming={isStreaming} />
          </div>

          {/* Input */}
          <ChatInput
            onSend={sendMessage}
            isDisabled={isStreaming || allSelectedIds.length === 0}
          />
        </div>
      </div>

      {/* Warning if no selection */}
      {allSelectedIds.length === 0 && (
        <div className="mt-4 rounded-lg border border-warning bg-warning/10 p-4">
          <p className="text-sm text-warning-foreground">
            Please select at least one paper or document to start chatting
          </p>
        </div>
      )}
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
