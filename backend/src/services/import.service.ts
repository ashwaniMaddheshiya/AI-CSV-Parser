import { config } from "../config/index.js";
import { extractBatchWithRetry } from "./ai.service.js";
import { parseCsvBuffer, validateCsvRows } from "./csv.service.js";
import { validateAndSanitizeRecords } from "./validation.service.js";
import { ImportResponse } from "../types/index.js";
import { chunkArray } from "../utils/index.js";
import { importResponseSchema } from "../validators/index.js";

export async function processImport(fileBuffer: Buffer): Promise<ImportResponse> {
  const rows = await parseCsvBuffer(fileBuffer);
  validateCsvRows(rows);

  const batches = chunkArray(rows, config.batchSize);
  const allRecords: ImportResponse["records"] = [];
  const allSkipped: ImportResponse["skippedRecords"] = [];

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const startIndex = batchIndex * config.batchSize;

    const result = await extractBatchWithRetry(batch, startIndex);
    allRecords.push(...result.records);
    allSkipped.push(...result.skippedRecords);
  }

  const { validRecords, skippedRecords: postValidationSkipped } =
    validateAndSanitizeRecords(allRecords);

  const response: ImportResponse = {
    success: true,
    imported: validRecords.length,
    skipped: allSkipped.length + postValidationSkipped.length,
    records: validRecords,
    skippedRecords: [...allSkipped, ...postValidationSkipped],
  };

  return importResponseSchema.parse(response);
}
