import dotenv from "dotenv";

dotenv.config();

function parseCorsOrigins(value: string): string[] {
  if (!value) {
    return ["http://localhost:3000"];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const config = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-pro",
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? "10", 10),
  batchSize: parseInt(process.env.BATCH_SIZE ?? "50", 10),
  aiRetryAttempts: parseInt(process.env.AI_RETRY_ATTEMPTS ?? "3", 10),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN ?? "http://localhost:3000"),
} as const;

export function validateConfig(): void {
  if (!config.geminiApiKey) {
    console.warn(
      "Warning: GEMINI_API_KEY is not set. AI extraction will fail until configured.",
    );
  }
}
