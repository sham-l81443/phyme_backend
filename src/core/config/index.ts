import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  // Add other configuration sections as needed
} as const;

export default config;
