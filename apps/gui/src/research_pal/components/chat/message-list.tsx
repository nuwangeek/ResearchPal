'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import { MessageBubble } from './message-bubble';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Start a conversation</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Select papers or documents and ask questions about them
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={isStreaming && index === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
