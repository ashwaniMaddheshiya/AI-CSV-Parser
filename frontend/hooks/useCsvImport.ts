"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { importCsvFile } from "@/services/api";
import { parseCsvFile } from "@/services/csvParser";
import { CsvPreviewData, ImportResponse, ImportStep } from "@/types";
import { useImportProgress } from "./useImportProgress";

interface UseCsvImportReturn {
  step: ImportStep;
  previewData: CsvPreviewData | null;
  selectedFile: File | null;
  importResult: ImportResponse | null;
  isParsing: boolean;
  isImporting: boolean;
  importProgress: number;
  handleFileSelect: (file: File) => Promise<void>;
  handleConfirmImport: () => Promise<void>;
  handleReset: () => void;
}

export function useCsvImport(): UseCsvImportReturn {
  const [step, setStep] = useState<ImportStep>("upload");
  const [previewData, setPreviewData] = useState<CsvPreviewData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [completedProgress, setCompletedProgress] = useState(0);

  const { progress: animatedProgress } = useImportProgress({
    isActive: isImporting,
    rowCount: previewData?.rowCount ?? 0,
  });

  const importProgress = completedProgress > 0 ? completedProgress : animatedProgress;

  const handleFileSelect = useCallback(async (file: File) => {
    setIsParsing(true);
    setImportResult(null);
    setCompletedProgress(0);

    try {
      const result = await parseCsvFile(file);

      if (!result.success || !result.data) {
        toast.error(result.error ?? "Failed to parse CSV");
        return;
      }

      setSelectedFile(file);
      setPreviewData(result.data);
      setStep("preview");
      toast.success(`Loaded ${result.data.rowCount.toLocaleString()} rows from ${file.name}`);
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleConfirmImport = useCallback(async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setCompletedProgress(0);
    setStep("importing");

    try {
      const result = await importCsvFile(selectedFile);
      setCompletedProgress(100);
      setImportResult(result);
      setStep("results");
      toast.success(
        `Import complete: ${result.imported.toLocaleString()} imported, ${result.skipped.toLocaleString()} skipped`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Import failed";
      toast.error(message);
      setStep("preview");
    } finally {
      setIsImporting(false);
    }
  }, [selectedFile]);

  const handleReset = useCallback(() => {
    setStep("upload");
    setPreviewData(null);
    setSelectedFile(null);
    setImportResult(null);
    setIsParsing(false);
    setIsImporting(false);
    setCompletedProgress(0);
  }, []);

  return {
    step,
    previewData,
    selectedFile,
    importResult,
    isParsing,
    isImporting,
    importProgress,
    handleFileSelect,
    handleConfirmImport,
    handleReset,
  };
}
