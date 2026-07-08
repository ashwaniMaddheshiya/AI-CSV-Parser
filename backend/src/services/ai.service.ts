import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/index.js";
import {
  CRM_EXTRACTION_SYSTEM_PROMPT,
  buildExtractionPrompt,
} from "../prompts/extraction.prompt.js";
import { AiBatchResult, CsvRow } from "../types/index.js";
import { aiExtractionResponseSchema } from "../validators/index.js";
import { sleep } from "../utils/index.js";

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const model = genAI.getGenerativeModel({
  model: config.geminiModel,
});

export async function extractBatchWithRetry(
  rows: CsvRow[],
  startIndex: number,
  maxAttempts: number = config.aiRetryAttempts,
): Promise<AiBatchResult> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(
        `🚀 AI Batch ${startIndex} | Attempt ${attempt}/${maxAttempts}`,
      );

      return await extractBatch(rows, startIndex);
    } catch (error) {
      lastError = normalizeAiError(error);

      console.error(
        `❌ Attempt ${attempt} failed: ${lastError.message}`,
      );

      if (attempt < maxAttempts && isRetryableError(lastError)) {
        const delay = getRetryDelayMs(lastError, attempt);

        console.log(`⏳ Retrying after ${delay} ms...\n`);

        await sleep(delay);
        continue;
      }

      throw lastError;
    }
  }

  throw lastError ?? new Error("AI extraction failed after retries");
}

async function extractBatch(
  rows: CsvRow[],
  startIndex: number,
): Promise<AiBatchResult> {
  if (!config.geminiApiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const prompt = buildExtractionPrompt(rows, startIndex);

  console.log("========================================");
  console.log(`📦 Batch: ${startIndex} - ${startIndex + rows.length - 1}`);
  console.log(`📄 Rows: ${rows.length}`);
  console.log(
    `📝 Prompt Size: ${Buffer.byteLength(prompt, "utf8")} bytes`,
  );
  console.log("========================================");

  console.time("🤖 Gemini Request");

  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${CRM_EXTRACTION_SYSTEM_PROMPT}\n\n${prompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0,
    },
  });

  console.timeEnd("🤖 Gemini Request");

  const content = response.response.text();

  if (!content) {
    throw new Error("Empty response from AI");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    console.error("========== INVALID JSON ==========");
    console.error(content.substring(0, 1000));
    console.error("==================================");

    throw new Error("Malformed AI response");
  }

  const validated = aiExtractionResponseSchema.parse(parsed);

  return {
    records: validated.records,
    skippedRecords: validated.skipped,
  };
}

function normalizeAiError(error: unknown): Error {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes("resource_exhausted") ||
      message.includes("429") ||
      message.includes("rate limit")
    ) {
      const err = new Error(
        "Gemini rate limit exceeded. Please try again shortly.",
      );
      err.name = "RateLimitError";
      return err;
    }

    if (
      message.includes("timeout") ||
      message.includes("408") ||
      message.includes("deadline")
    ) {
      const err = new Error(
        "Gemini request timed out. Please try again.",
      );
      err.name = "TimeoutError";
      return err;
    }

    return error;
  }

  return new Error(String(error));
}

function isRetryableError(error: Error): boolean {
  return (
    error.name === "RateLimitError" ||
    error.name === "TimeoutError" ||
    error.message.includes("Malformed AI response") ||
    error.message.includes("Empty response")
  );
}

function getRetryDelayMs(error: Error, attempt: number): number {
  if (error.name === "RateLimitError") {
    return Math.min(1000 * Math.pow(2, attempt), 30000);
  }

  return Math.min(500 * Math.pow(2, attempt), 10000);
}