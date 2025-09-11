import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
  },
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false', // enabled by default
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes in ms
    max: parseInt(process.env.RATE_LIMIT_MAX || '1000'), // max requests per window
  },
  upload: {
    pdfMaxSize: parseInt(process.env.PDF_MAX_SIZE_MB || '10') * 1024 * 1024, // Convert MB to bytes, default 10MB
    pdfMaxFiles: parseInt(process.env.PDF_MAX_FILES || '5'), // Max number of PDFs per upload
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  // Add other configuration sections as needed
} as const;

export default config;
