import { MAX_FILE_SIZE_BYTES } from "./constants";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateCsvFile(file: File): FileValidationResult {
  const isCsv =
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel" ||
    file.type === "text/plain" ||
    file.name.toLowerCase().endsWith(".csv");

  if (!isCsv) {
    return { valid: false, error: "Only CSV files are allowed" };
  }

  if (file.size === 0) {
    return { valid: false, error: "File is empty" };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File exceeds maximum size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`,
    };
  }

  return { valid: true };
}

export function getDropzoneErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "file-invalid-type":
      return "Only CSV files are allowed";
    case "file-too-large":
      return `File exceeds maximum size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`;
    case "too-many-files":
      return "Please upload only one file at a time";
    default:
      return "File could not be accepted";
  }
}
