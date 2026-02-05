import { Document } from '@/types/document';
import { DocumentCard } from './document-card';

interface DocumentGridProps {
  documents: Document[];
  onDelete: (documentId: string) => void;
  onChat: (documentId: string) => void;
}

export function DocumentGrid({ documents, onDelete, onChat }: DocumentGridProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onDelete={() => onDelete(document.id)}
          onChat={() => onChat(document.id)}
        />
      ))}
    </div>
  );
}
