import express from "express";
import "dotenv/config";
import helmet from "helmet";
import corsMiddleware from "./core/middleware/cors";
import rateLimitMiddleware from "./core/middleware/ratelimit";
import cookieParser from "cookie-parser";
import errorHandler from "./core/middleware/errorHandler";
import passport from "passport";
import googleConfig from "./core/config/googleConfig";
import { appRoutes } from "./api";
import morgan from "morgan";
import { logger } from "./core/utils/logger";



// Validate environment variables
const requiredEnv = ["PORT", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required env variable: ${key}`);
    process.exit(1);
  }
});

const app = express();
app.set('trust proxy', 1);


// Security middleware
app.use(helmet({ contentSecurityPolicy: false })); // Customize as needed
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(corsMiddleware);
app.use(rateLimitMiddleware);

// Parsing Middleware
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json({ limit: "10kb", strict: true }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

googleConfig();

// Routes
appRoutes(app);



// Error handling middleware
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
if (isNaN(PORT)) {
  console.error("Invalid PORT value");
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Shutdown timed out, forcing exit");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Unhandled error and rejection handlers
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});