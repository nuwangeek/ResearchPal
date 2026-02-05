import { UploadState } from '@/types/document';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadProgressProps {
  uploads: UploadState[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadProgress({ uploads }: UploadProgressProps) {
  if (uploads.length === 0) return null;

  return (
    <div className="space-y-2">
      {uploads.map((upload) => (
        <Card key={upload.fileId} className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* File info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{upload.fileName}</p>
                {upload.status === 'uploading' && (
                  <Badge variant="secondary">Uploading</Badge>
                )}
                {upload.status === 'processing' && (
                  <Badge variant="secondary">Processing</Badge>
                )}
                {upload.status === 'ready' && (
                  <Badge variant="default">Ready</Badge>
                )}
                {upload.status === 'error' && (
                  <Badge variant="destructive">Error</Badge>
                )}
              </div>

              {/* Progress bar */}
              {(upload.status === 'uploading' || upload.status === 'processing') && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{upload.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error message */}
              {upload.status === 'error' && upload.errorMessage && (
                <p className="mt-1 text-xs text-destructive">{upload.errorMessage}</p>
              )}
            </div>

            {/* Status icon */}
            <div>
              {upload.status === 'ready' && (
                <CheckCircle className="h-5 w-5 text-success" />
              )}
              {upload.status === 'error' && (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}
              {(upload.status === 'uploading' || upload.status === 'processing') && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
