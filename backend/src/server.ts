import app from "./app.js";
import { config, validateConfig } from "./config/index.js";

validateConfig();

const server = app.listen(config.port, () => {
  console.log(`Backend server running on http://localhost:${config.port}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed");
  });
});
