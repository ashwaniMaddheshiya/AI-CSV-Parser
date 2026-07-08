"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { UploadZone } from "@/components/Upload/UploadZone";
import { PreviewTable } from "@/components/PreviewTable/PreviewTable";
import { ResultTable } from "@/components/ResultTable/ResultTable";
import { ImportProgress } from "@/components/Progress/ImportProgress";
import { TableSkeleton } from "@/components/Loading/TableSkeleton";
import { useCsvImport } from "@/hooks/useCsvImport";

const Home = () => {
  const {
    step,
    previewData,
    importResult,
    isParsing,
    isImporting,
    importProgress,
    handleFileSelect,
    handleConfirmImport,
    handleReset,
  } = useCsvImport();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">AI CSV Importer</h1>
            <p className="text-sm text-muted-foreground">
              Upload any CSV and convert it to CRM format
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {step === "upload" && !isParsing && (
          <UploadZone onFileSelect={handleFileSelect} isLoading={isParsing} />
        )}

        {step === "upload" && isParsing && <TableSkeleton columns={6} rows={6} />}

        {step === "preview" && previewData && (
          <PreviewTable
            data={previewData}
            onConfirm={handleConfirmImport}
            onCancel={handleReset}
            isUploading={isImporting}
          />
        )}

        {step === "importing" && (
          <ImportProgress
            progress={importProgress}
            title="Processing with AI"
            description={`Extracting and normalizing ${previewData?.rowCount.toLocaleString() ?? ""} rows into CRM format...`}
          />
        )}

        {step === "results" && importResult && (
          <ResultTable result={importResult} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

export default Home;