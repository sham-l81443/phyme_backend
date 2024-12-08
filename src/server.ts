import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import corsMiddleware from './middleware/cors';
import rateLimitMiddleware from './middleware/ratelimit';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import initializeSupabase from './lib/supabase';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(rateLimitMiddleware);

// Parsinf Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api', authRoutes)


// Error handling middleware
app.use(errorHandler);

// initializeSupabase()

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});


process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});


// Unhandled error and rejection handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

