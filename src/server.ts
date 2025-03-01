import express from "express";
import "dotenv/config";
import helmet from "helmet";
import corsMiddleware from "./middleware/cors";
import rateLimitMiddleware from "./middleware/ratelimit";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";
import quizRoutes from "./routes/quizRoutes";
import passport from "passport";
import googleConfig from "./config/googleConfig";
import fileRoutes from "./routes/fileUploadRoutes";

const app = express();

// Security middleware
app.use(helmet());
app.use(corsMiddleware);
// app.use(rateLimitMiddleware);

// Parsinf Middleware
app.use(cookieParser('userId'));
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

googleConfig();



app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes)
app.use('/api/file', fileRoutes)

// Error handling middleware
app.use(errorHandler);

// initializeSupabase()
const PORT = process.env.PORT || "3000";

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Unhandled error and rejection handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
