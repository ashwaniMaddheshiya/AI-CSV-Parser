import { Request, Response, NextFunction } from "express";
import multer from "multer";

export interface AppError extends Error {
  statusCode?: number;
}

function getStatusCode(err: AppError): number {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") return 413;
    return 400;
  }

  if (err.statusCode) return err.statusCode;

  const message = err.message.toLowerCase();
  if (message.includes("only csv")) return 400;
  if (message.includes("empty") || message.includes("no column")) return 400;
  if (message.includes("csv") || message.includes("parse")) return 422;
  if (message.includes("rate limit")) return 429;
  if (message.includes("timed out") || message.includes("timeout")) return 504;
  if (message.includes("gemini") || message.includes("ai")) return 502;

  return 500;
}

function getErrorMessage(err: AppError): string {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return "File exceeds maximum allowed size";
      case "LIMIT_UNEXPECTED_FILE":
        return "Unexpected file field. Use 'file' as the field name.";
      default:
        return err.message;
    }
  }

  return err.message || "Internal server error";
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = getStatusCode(err);
  const message = getErrorMessage(err);

  console.error(`[Error] ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
}
