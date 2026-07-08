import Papa from "papaparse";
import { CsvPreviewData } from "@/types";
import { validateCsvFile } from "@/utils/validation";

export interface ParseCsvResult {
  success: boolean;
  data?: CsvPreviewData;
  error?: string;
}

export function parseCsvFile(file: File): Promise<ParseCsvResult> {
  const validation = validateCsvFile(file);
  if (!validation.valid) {
    return Promise.resolve({ success: false, error: validation.error });
  }

  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const criticalErrors = results.errors.filter(
          (e) => e.type === "Quotes" || e.type === "FieldMismatch",
        );

        if (criticalErrors.length > 0) {
          resolve({
            success: false,
            error: criticalErrors[0]?.message ?? "Failed to parse CSV",
          });
          return;
        }

        const rows = results.data.filter((row) =>
          Object.values(row).some((val) => val?.trim()),
        );

        if (rows.length === 0) {
          resolve({
            success: false,
            error: "CSV file is empty or contains no data rows",
          });
          return;
        }

        const headers = (results.meta.fields ?? Object.keys(rows[0] ?? {})).map((h) =>
          h.trim(),
        );

        if (headers.length === 0 || headers.every((h) => !h)) {
          resolve({
            success: false,
            error: "CSV file has no column headers",
          });
          return;
        }

        resolve({
          success: true,
          data: {
            headers,
            rows,
            fileName: file.name,
            fileSize: file.size,
            rowCount: rows.length,
          },
        });
      },
      error: (error) => {
        resolve({
          success: false,
          error: error.message ?? "Failed to parse CSV",
        });
      },
    });
  });
}
