import { Request, Response, NextFunction } from "express";
import { processImport } from "../services/import.service.js";

export async function importCsv(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No CSV file uploaded",
      });
      return;
    }

    const result = await processImport(req.file.buffer);
    console.log("Final Result",result);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function healthCheck(_req: Request, res: Response): void {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
}
