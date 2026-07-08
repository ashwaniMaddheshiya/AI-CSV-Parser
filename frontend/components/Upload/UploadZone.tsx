"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { cn, formatFileSize } from "@/utils";
import { ACCEPTED_CSV_TYPES, MAX_FILE_SIZE_BYTES } from "@/utils/constants";
import { getDropzoneErrorMessage, validateCsvFile } from "@/utils/validation";
import { toast } from "sonner";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function UploadZone({ onFileSelect, isLoading = false }: UploadZoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAcceptedFile = useCallback(
    (file: File) => {
      const validation = validateCsvFile(file);
      if (!validation.valid) {
        toast.error(validation.error ?? "Invalid file");
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) handleAcceptedFile(file);
    },
    [handleAcceptedFile],
  );

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    const rejection = rejections[0];
    if (!rejection) return;

    const errorCode = rejection.errors[0]?.code ?? "unknown";
    toast.error(getDropzoneErrorMessage(errorCode));
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDropRejected,
    accept: ACCEPTED_CSV_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE_BYTES,
    multiple: false,
    disabled: isLoading,
    noClick: false,
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors",
          isLoading && "pointer-events-none opacity-60",
          isDragActive && !isDragReject && "border-primary bg-primary/5",
          isDragReject && "border-red-500 bg-red-500/5",
          !isDragActive && "border-border bg-card hover:border-primary/50 hover:bg-accent/50",
        )}
      >
        <input {...getInputProps()} />
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          {isLoading ? (
            <svg
              className="h-8 w-8 animate-spin text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          )}
        </div>
        <h2 className="mb-2 text-lg font-semibold">
          {isLoading
            ? "Parsing CSV..."
            : isDragActive
              ? "Drop your CSV here"
              : "Upload CSV file"}
        </h2>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          Drag and drop your CSV file here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          CSV files only &bull; Max {MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB
        </p>
      </div>

      {selectedFile && !isLoading && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <p className="font-medium">{selectedFile.name}</p>
          <p className="text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
        </div>
      )}
    </div>
  );
}
