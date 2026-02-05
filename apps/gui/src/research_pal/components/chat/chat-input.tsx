'use client';

import { useState, KeyboardEvent, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mic, Send, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVoiceInput } from '@/hooks/use-voice-input';
import { VoiceIndicator } from './voice-indicator';
import { useChatStore } from '@/stores/chat-store';

interface ChatInputProps {
  onSend: (content: string) => void;
  isDisabled: boolean;
}

export function ChatInput({ onSend, isDisabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const { isRecording: isRecordingStore } = useChatStore();
  const { isSupported, isRecording, duration, startRecording, stopRecording } = useVoiceInput((text) => {
    setInput((prev) => prev + ' ' + text);
  });

  // Sync recording state with store
  useEffect(() => {
    useChatStore.setState({ isRecording });
  }, [isRecording]);

  const handleSend = () => {
    if (!input.trim() || isDisabled) return;

    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-2">
        {/* Voice Indicator */}
        {isRecording && <VoiceIndicator isRecording={isRecording} duration={duration} />}

        {/* Input Area */}
        <div className="flex gap-2">
          {/* Voice Button */}
          {isSupported && (
            <Button
              type="button"
              variant={isRecording ? 'destructive' : 'outline'}
              size="icon"
              onClick={handleMicClick}
              disabled={isDisabled}
            >
              {isRecording ? (
                <Square className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Text Input */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the selected papers..."
            disabled={isDisabled || isRecording}
            className="min-h-[60px] max-h-[200px] resize-none"
            rows={2}
          />

          {/* Send Button */}
          <Button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isDisabled || isRecording}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Hint */}
        <p className="text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
          {isSupported && ' • Click mic for voice input'}
        </p>
      </div>
    </div>
  );
}
