import express from "express";
import cors from "cors";
import importRoutes from "./routes/import.routes.js";
import { config } from "./config/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowed = config.corsOrigins.some((allowedOrigin) => {
        if (allowedOrigin === "*") {
          return true;
        }

        if (allowedOrigin === origin) {
          return true;
        }

        const escapedPattern = allowedOrigin.replace(/[.+^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`^${escapedPattern.replace(/\\\*/g, ".*")}$`);
        return regex.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api", importRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
