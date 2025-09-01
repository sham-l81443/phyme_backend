import cors from "cors";
import { config } from "../config";

const allowedOrigins = ["https://phymelearning.com","http://localhost:3000"];

// Check if CORS is enabled via environment variable
const isCorsEnabled = config.cors.enabled;

const corsMiddleware = isCorsEnabled ? cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Custom-Header",
    "Range"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}) : (req: any, res: any, next: any) => {
  // If CORS is disabled, just pass through to next middleware
  next();
};

export default corsMiddleware;