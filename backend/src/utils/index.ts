import { CsvRow } from "../types/index.js";

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
}

export function rowsToJson(rows: CsvRow[]): Record<string, string>[] {
  return rows.map((row) => ({ ...row }));
}
