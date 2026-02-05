import { useState, useCallback, DragEvent } from 'react';

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function useFileUpload(onFilesSelected: (files: File[]) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max 50MB)`);
        return;
      }

      valid.push(file);
    });

    return { valid, errors };
  };

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set dragging to false if we're leaving the drop zone itself
    const target = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;

    if (!target.contains(relatedTarget)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const { valid, errors } = validateFiles(files);

      if (errors.length > 0) {
        console.error('File validation errors:', errors);
        // TODO: Show toast notifications for errors
      }

      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    },
    [onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      const { valid, errors } = validateFiles(files);

      if (errors.length > 0) {
        console.error('File validation errors:', errors);
        // TODO: Show toast notifications for errors
      }

      if (valid.length > 0) {
        onFilesSelected(valid);
      }

      // Reset input value so the same file can be selected again
      e.target.value = '';
    },
    [onFilesSelected]
  );

  return {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInput,
  };
}
