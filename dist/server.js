"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("./core/middleware/cors"));
const ratelimit_1 = __importDefault(require("./core/middleware/ratelimit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = __importDefault(require("./core/middleware/errorHandler"));
const passport_1 = __importDefault(require("passport"));
const googleConfig_1 = __importDefault(require("./core/config/googleConfig"));
const api_1 = require("./api");
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./core/utils/logger");
const requiredEnv = ["PORT", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Missing required env variable: ${key}`);
        process.exit(1);
    }
});
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
app.use((0, morgan_1.default)("combined", { stream: { write: (msg) => logger_1.logger.info(msg.trim()) } }));
app.use(cors_1.default);
app.use(ratelimit_1.default);
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use(express_1.default.json({ limit: "10kb", strict: true }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
(0, googleConfig_1.default)();
(0, api_1.appRoutes)(app);
app.use(errorHandler_1.default);
const PORT = Number(process.env.PORT) || 3000;
if (isNaN(PORT)) {
    console.error("Invalid PORT value");
    process.exit(1);
}
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
const shutdown = (signal) => {
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
process.on("unhandledRejection", (reason, promise) => {
    logger_1.logger.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});
process.on("uncaughtException", (error) => {
    logger_1.logger.error("Uncaught Exception:", error);
    process.exit(1);
});
