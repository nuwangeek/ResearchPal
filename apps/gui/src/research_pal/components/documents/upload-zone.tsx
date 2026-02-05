'use client';

import { useRef } from 'react';
import { useFileUpload } from '@/hooks/use-file-upload';
import { Card } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
  acceptedTypes?: string[];
}

export function UploadZone({ onFilesSelected, isUploading, acceptedTypes }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInput,
  } = useFileUpload(onFilesSelected);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-2 border-dashed transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-muted-foreground/50',
        isUploading && 'pointer-events-none opacity-50'
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center p-12 text-center cursor-pointer">
        <Upload className={cn('h-12 w-12 mb-4', isDragging ? 'text-primary' : 'text-muted-foreground')} />

        <h3 className="mb-2 text-lg font-semibold">
          {isDragging ? 'Drop files here' : 'Upload Documents'}
        </h3>

        <p className="mb-4 text-sm text-muted-foreground">
          Drag and drop files here, or click to browse
        </p>

        <p className="text-xs text-muted-foreground">
          Supported: PDF, Images (PNG, JPG), Word documents (max 50MB)
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptedTypes?.join(',') || '.pdf,.png,.jpg,.jpeg,.doc,.docx'}
        onChange={handleFileInput}
        className="hidden"
      />
    </Card>
  );
}
