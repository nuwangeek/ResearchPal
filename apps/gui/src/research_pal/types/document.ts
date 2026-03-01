export type DocumentType = 'pdf' | 'image' | 'word' | 'other';
export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'error';

export interface Document {
  id: string;
  title: string;                   // Extracted or filename
  fileName: string;
  fileType: DocumentType;
  fileSizeBytes: number;
  status: DocumentStatus;
  errorMessage?: string;
  uploadedAt: string;
  processedAt?: string;
}

export interface UploadState {
  fileId: string;                  // Client-generated temp ID
  fileName: string;
  progress: number;                // 0-100
  status: 'uploading' | 'processing' | 'ready' | 'error';
  errorMessage?: string;
}
