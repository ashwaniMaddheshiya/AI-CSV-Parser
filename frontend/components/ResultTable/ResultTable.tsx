"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { CRMRecord, ImportResponse } from "@/types";

interface ResultTableProps {
  result: ImportResponse;
  onReset: () => void;
}

const CRM_COLUMNS: (keyof CRMRecord)[] = [
  "name",
  "email",
  "mobile_without_country_code",
  "company",
  "city",
  "state",
  "country",
  "crm_status",
  "data_source",
  "lead_owner",
  "created_at",
  "crm_note",
];

export function ResultTable({ result, onReset }: ResultTableProps) {
  const columnHelper = createColumnHelper<CRMRecord>();

  const columns = useMemo(
    () =>
      CRM_COLUMNS.map((key) =>
        columnHelper.accessor(key, {
          header: () => key.replace(/_/g, " "),
          cell: (info) => {
            const value = info.getValue();
            return value == null || value === "" ? "-" : value;
          },
        }),
      ),
    [columnHelper],
  );

  const table = useReactTable({
    data: result.records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Import Results</h2>
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-green-600 dark:text-green-400">
              {result.imported} imported
            </span>
            <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-600 dark:text-yellow-400">
              {result.skipped} skipped
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Import Another File
        </button>
      </div>

      {result.records.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="max-h-[600px] overflow-auto">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="whitespace-nowrap border-b border-border px-4 py-3 text-left font-medium capitalize text-muted-foreground"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-border hover:bg-accent/50">
                    {row.getVisibleCells().map((cell) => {
                      const cellValue = cell.getValue();
                      const displayValue = cellValue == null || cellValue === "" ? "-" : String(cellValue);
                      const isTruncated = displayValue.length > 30;

                      return (
                        <td key={cell.id} className="max-w-xs px-4 py-2">
                          <div
                            className={`max-w-[240px] ${isTruncated ? "truncate" : "whitespace-normal"}`}
                            title={isTruncated ? displayValue : undefined}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result.skippedRecords.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 font-medium">Skipped Records</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {result.skippedRecords.map((record) => (
              <li key={record.rowIndex}>
                Row {record.rowIndex + 1}: {record.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
