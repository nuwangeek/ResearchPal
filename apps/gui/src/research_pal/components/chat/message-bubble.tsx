import { ChatMessage } from '@/types/chat';
import { SourceCitation } from './source-citation';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message content */}
      <div
        className={cn(
          'flex-1 space-y-2 rounded-lg px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground ml-12'
            : 'bg-muted mr-12'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
          {isStreaming && <span className="animate-pulse">▊</span>}
        </p>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {message.citations.map((citation, index) => (
              <SourceCitation
                key={index}
                paperTitle={citation.paperTitle}
                section={citation.section}
              />
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className={cn('text-xs', isUser ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
          {new Date(message.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
