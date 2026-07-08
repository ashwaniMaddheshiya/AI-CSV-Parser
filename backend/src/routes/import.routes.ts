import { Router } from "express";
import { healthCheck, importCsv } from "../controllers/import.controller.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/health", healthCheck);
router.post("/import", uploadMiddleware.single("file"), importCsv);

export default router;
