'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/top-bar';
import { UploadZone } from '@/components/documents/upload-zone';
import { UploadProgress } from '@/components/documents/upload-progress';
import { DocumentGrid } from '@/components/documents/document-grid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDocuments } from '@/hooks/use-documents';
import { toast } from 'sonner';

export default function DocumentsPage() {
  const router = useRouter();
  const { documents, uploads, isLoading, uploadFiles, deleteDocument } = useDocuments();
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    try {
      await uploadFiles(files);
      toast.success(`Uploading ${files.length} file(s)`);
    } catch (error) {
      toast.error('Failed to upload files');
    }
  };

  const handleDelete = async () => {
    if (!deletingDocId) return;

    try {
      await deleteDocument(deletingDocId);
      setDeletingDocId(null);
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleChat = (documentId: string) => {
    router.push(`/app/chat?documentId=${documentId}`);
  };

  return (
    <>
      <TopBar title="Documents" />

      <div className="mt-6 space-y-6">
        {/* Upload Zone */}
        <UploadZone
          onFilesSelected={handleFilesSelected}
          isUploading={uploads.some((u) => u.status === 'uploading')}
        />

        {/* Upload Progress */}
        {uploads.length > 0 && <UploadProgress uploads={uploads} />}

        {/* Document Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        ) : (
          <DocumentGrid
            documents={documents}
            onDelete={setDeletingDocId}
            onChat={handleChat}
          />
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingDocId} onOpenChange={() => setDeletingDocId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingDocId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
