import express from "express";
import { HealthController } from "./health.controller";

const healthRouter = express.Router();

// Health check endpoint
healthRouter.get('/health', HealthController.healthCheck);

// PgBouncer statistics endpoint
healthRouter.get('/health/pgbouncer', HealthController.pgbouncerStats);

export default healthRouter;
