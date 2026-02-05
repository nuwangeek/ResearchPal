import Link from 'next/link';
import { Document } from '@/types/document';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, Image, FileType, MoreVertical, MessageSquare, Trash2 } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  onDelete: () => void;
  onChat: () => void;
}

function getFileIcon(fileType: Document['fileType']) {
  switch (fileType) {
    case 'pdf':
      return FileText;
    case 'image':
      return Image;
    case 'word':
      return FileType;
    default:
      return FileText;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentCard({ document, onDelete, onChat }: DocumentCardProps) {
  const Icon = getFileIcon(document.fileType);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Icon className="h-8 w-8 flex-shrink-0 text-muted-foreground" />
            <div className="space-y-1">
              <h3 className="font-semibold line-clamp-1">{document.title}</h3>
              <p className="text-xs text-muted-foreground">{document.fileName}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onChat}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {document.fileType.toUpperCase()}
          </Badge>
          <Badge
            variant={document.status === 'ready' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {document.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatFileSize(document.fileSizeBytes)}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Uploaded {new Date(document.uploadedAt).toLocaleDateString()}</span>
          {document.status === 'ready' && (
            <Button size="sm" variant="outline" onClick={onChat}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
