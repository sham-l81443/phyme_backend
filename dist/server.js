"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("./middleware/cors"));
const ratelimit_1 = __importDefault(require("./middleware/ratelimit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, helmet_1.default)());
app.use(cors_1.default);
app.use(ratelimit_1.default);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (_req, res, _next) => {
    res.send('Hello World!');
});
app.use('/api', authRoutes_1.default);
app.use(errorHandler_1.default);
const PORT = process.env.PORT || "3000";
const server = app.listen(PORT, () => {
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
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
