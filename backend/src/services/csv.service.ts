import { Readable } from "stream";
import csvParser from "csv-parser";
import { CsvRow } from "../types/index.js";

export async function parseCsvBuffer(buffer: Buffer): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CsvRow[] = [];
    const stream = Readable.from(buffer);

    stream
      .pipe(csvParser())
      .on("data", (row: CsvRow) => {
        rows.push(row);
      })
      .on("end", () => {
        resolve(rows);
      })
      .on("error", (error: Error) => {
        reject(error);
      });
  });
}

export function validateCsvRows(rows: CsvRow[]): void {
  if (rows.length === 0) {
    throw new Error("CSV file is empty or contains no data rows");
  }
}
