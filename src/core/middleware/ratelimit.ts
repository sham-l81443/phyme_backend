import rateLimit from "express-rate-limit";
import { config } from "../config";

const rateLimitMiddleware = config.rateLimit.enabled ? rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: "Too many requests from this IP, please try again later.",
}) : (req: any, res: any, next: any) => {
    // If rate limiting is disabled, just pass through to next middleware
    next();
};
  
export default rateLimitMiddleware;