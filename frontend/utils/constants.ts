export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ACCEPTED_CSV_TYPES = {
  "text/csv": [".csv"],
  "application/vnd.ms-excel": [".csv"],
  "text/plain": [".csv"],
} as const;
