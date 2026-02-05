import { create } from 'zustand';
import { Document, UploadState } from '@/types/document';
import apiClient from '@/lib/api-client';

interface DocumentStore {
  documents: Document[];
  uploads: UploadState[];
  isLoading: boolean;
  error: string | null;
  fetchDocuments: () => Promise<void>;
  uploadFiles: (files: File[]) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateUploadProgress: (fileId: string, progress: number) => void;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  uploads: [],
  isLoading: false,
  error: null,

  fetchDocuments: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get<PaginatedResponse<Document>>('/documents');
      // set({ documents: response.data, isLoading: false });

      // Mock data for MVP
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockDocuments: Document[] = [
        {
          id: 'doc-1',
          title: 'Attention Is All You Need',
          fileName: 'attention_paper.pdf',
          fileType: 'pdf',
          fileSizeBytes: 2456789,
          status: 'ready',
          uploadedAt: '2024-01-15T00:00:00Z',
          processedAt: '2024-01-15T00:05:00Z',
        },
        {
          id: 'doc-2',
          title: 'Neural Architecture Search',
          fileName: 'nas_paper.pdf',
          fileType: 'pdf',
          fileSizeBytes: 1876543,
          status: 'ready',
          uploadedAt: '2024-01-20T00:00:00Z',
          processedAt: '2024-01-20T00:03:00Z',
        },
      ];
      set({ documents: mockDocuments, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch documents',
        isLoading: false,
      });
    }
  },

  uploadFiles: async (files: File[]) => {
    // Initialize upload states
    const newUploads: UploadState[] = files.map((file) => ({
      fileId: `${file.name}-${Date.now()}`,
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    }));

    set({ uploads: [...get().uploads, ...newUploads] });

    // Upload each file
    for (const file of files) {
      const uploadState = newUploads.find((u) => u.fileName === file.name);
      if (!uploadState) continue;

      try {
        // TODO: Replace with actual API call
        // await apiClient.uploadFile('/documents/upload', file, (progress) => {
        //   get().updateUploadProgress(uploadState.fileId, progress);
        // });

        // Mock upload with progress simulation
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          set({
            uploads: get().uploads.map((u) =>
              u.fileId === uploadState.fileId ? { ...u, progress } : u
            ),
          });
        }

        // Simulate processing
        set({
          uploads: get().uploads.map((u) =>
            u.fileId === uploadState.fileId
              ? { ...u, status: 'processing', progress: 100 }
              : u
          ),
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add to documents
        const newDoc: Document = {
          id: uploadState.fileId,
          title: file.name.replace(/\.[^/.]+$/, ''),
          fileName: file.name,
          fileType: file.type.includes('pdf') ? 'pdf' : 'other',
          fileSizeBytes: file.size,
          status: 'ready',
          uploadedAt: new Date().toISOString(),
          processedAt: new Date().toISOString(),
        };

        set({
          documents: [newDoc, ...get().documents],
          uploads: get().uploads.map((u) =>
            u.fileId === uploadState.fileId ? { ...u, status: 'ready' } : u
          ),
        });

        // Remove from uploads after 2 seconds
        setTimeout(() => {
          set({
            uploads: get().uploads.filter((u) => u.fileId !== uploadState.fileId),
          });
        }, 2000);
      } catch (error) {
        set({
          uploads: get().uploads.map((u) =>
            u.fileId === uploadState.fileId
              ? {
                  ...u,
                  status: 'error',
                  errorMessage: error instanceof Error ? error.message : 'Upload failed',
                }
              : u
          ),
        });
      }
    }
  },

  deleteDocument: async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // await apiClient.delete(`/documents/${id}`);

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({
        documents: get().documents.filter((doc) => doc.id !== id),
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete document',
      });
      throw error;
    }
  },

  updateUploadProgress: (fileId: string, progress: number) => {
    set({
      uploads: get().uploads.map((upload) =>
        upload.fileId === fileId ? { ...upload, progress } : upload
      ),
    });
  },
}));
