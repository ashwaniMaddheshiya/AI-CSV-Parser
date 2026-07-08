interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

const ROW_WIDTHS = [72, 88, 64, 96, 80, 76, 92, 68];

export function TableSkeleton({ columns = 5, rows = 8 }: TableSkeletonProps) {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-24 rounded-lg bg-muted" />
          <div className="h-10 w-32 rounded-lg bg-muted" />
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-muted p-4">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 w-24 rounded bg-background/50" />
            ))}
          </div>
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 border-b border-border p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 rounded bg-muted"
                style={{ width: `${ROW_WIDTHS[colIndex % ROW_WIDTHS.length]}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
