"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMemo, useRef } from "react";
import { CsvPreviewData } from "@/types";
import { formatFileSize } from "@/utils";

interface PreviewTableProps {
  data: CsvPreviewData;
  onConfirm: () => void;
  onCancel: () => void;
  isUploading: boolean;
}

const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 44;

export function PreviewTable({
  data,
  onConfirm,
  onCancel,
  isUploading,
}: PreviewTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const columnHelper = createColumnHelper<Record<string, string>>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "_rowNum",
        header: "#",
        cell: (info) => info.row.index + 1,
        size: 56,
      }),
      ...data.headers.map((header) =>
        columnHelper.accessor(header, {
          header: () => header,
          cell: (info) => {
            const value = info.getValue();
            return value == null || value === "" ? "-" : value;
          },
          size: 160,
        }),
      ),
    ],
    [data.headers, columnHelper],
  );

  const table = useReactTable({
    data: data.rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();
  const headerGroups = table.getHeaderGroups();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 15,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalHeight = rowVirtualizer.getTotalSize();
  const gridTemplateColumns = columns.map((col) => `${col.size ?? 160}px`).join(" ");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Preview: {data.fileName}</h2>
          <p className="text-sm text-muted-foreground">
            {data.rowCount.toLocaleString()} rows &bull; {data.headers.length} columns &bull;{" "}
            {formatFileSize(data.fileSize)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Showing raw CSV data exactly as uploaded — no AI processing yet
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isUploading}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isUploading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isUploading ? "Importing..." : "Confirm Import"}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div ref={scrollRef} className="max-h-[600px] overflow-auto">
          {/* Sticky header */}
          <div
            className="sticky top-0 z-10 grid border-b border-border bg-muted text-sm font-medium text-muted-foreground"
            style={{ gridTemplateColumns, minWidth: "max-content", height: HEADER_HEIGHT }}
          >
            {headerGroups[0]?.headers.map((header) => (
              <div key={header.id} className="flex items-center truncate px-4">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))}
          </div>

          {/* Virtualized body */}
          <div style={{ height: totalHeight, position: "relative", minWidth: "max-content" }}>
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <div
                  key={row.id}
                  className="absolute left-0 grid w-full border-b border-border text-sm hover:bg-accent/50"
                  style={{
                    gridTemplateColumns,
                    height: ROW_HEIGHT,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} className="flex items-center truncate px-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
