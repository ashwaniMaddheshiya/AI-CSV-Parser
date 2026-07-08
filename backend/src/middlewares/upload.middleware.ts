import multer from "multer";
import { config } from "../config/index.js";

const MAX_FILE_SIZE = config.maxFileSizeMb * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const isCsv =
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.originalname.toLowerCase().endsWith(".csv");

  if (isCsv) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
