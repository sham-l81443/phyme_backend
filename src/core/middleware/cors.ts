import cors from "cors";
import { config } from "../config";

// Parse allowed origins from environment variable
const getAllowedOrigins = () => {
  const origins = process.env.ALLOWED_ORIGINS || "";
  return origins.split(",").map(origin => origin.trim()).filter(origin => origin);
};

const allowedOrigins = getAllowedOrigins();

// Fallback origins if env variable is not set
const defaultOrigins = ["http://localhost:3000"];
const finalAllowedOrigins = allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins;

console.log("CORS Allowed Origins:", finalAllowedOrigins); // Debug log

const corsMiddleware = config.cors.enabled ? cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    
    if (finalAllowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      console.log("Allowed origins:", finalAllowedOrigins);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization", 
    "X-Custom-Header",
    "Range",
    "Accept",
    "Origin",
    "X-Requested-With"
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}) : (req: any, res: any, next: any) => next();

export default corsMiddleware;