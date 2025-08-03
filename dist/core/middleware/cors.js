"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const allowedOrigins = ["http://localhost:3000", "https://quizaalam.netlify.app"];
const corsMiddleware = (0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
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
});
exports.default = corsMiddleware;
