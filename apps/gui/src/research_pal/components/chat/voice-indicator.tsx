import { Mic } from 'lucide-react';

interface VoiceIndicatorProps {
  isRecording: boolean;
  duration: number;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function VoiceIndicator({ isRecording, duration }: VoiceIndicatorProps) {
  if (!isRecording) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-destructive/10 px-4 py-2 text-destructive">
      <Mic className="h-4 w-4 animate-pulse" />
      <span className="text-sm font-medium">Recording</span>
      <span className="text-sm">{formatDuration(duration)}</span>
    </div>
  );
}
