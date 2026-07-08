"use client";

interface UploadSuccessResult {
  message: string;
  fileName: string;
  totalRows: number;
  columnCount: number;
  headers: string[];
}

interface UploadSuccessProps {
  result: UploadSuccessResult;
  onReset: () => void;
}

export function UploadSuccess({ result, onReset }: UploadSuccessProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
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
            className="text-green-600 dark:text-green-400"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">Upload Successful</h2>
        <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>

        <dl className="mt-6 space-y-3 text-left text-sm">
          <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-2">
            <dt className="text-muted-foreground">File</dt>
            <dd className="font-medium">{result.fileName}</dd>
          </div>
          <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-2">
            <dt className="text-muted-foreground">Total Rows</dt>
            <dd className="font-medium">{result.totalRows.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-2">
            <dt className="text-muted-foreground">Columns</dt>
            <dd className="font-medium">{result.columnCount}</dd>
          </div>
        </dl>

        {result.headers.length > 0 && (
          <div className="mt-4 text-left">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Detected Headers
            </p>
            <div className="flex flex-wrap gap-2">
              {result.headers.map((header) => (
                <span
                  key={header}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {header}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Upload Another File
        </button>
      </div>
    </div>
  );
}
