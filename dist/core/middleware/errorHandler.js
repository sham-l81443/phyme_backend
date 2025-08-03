"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AppError_1 = require("../utils/errors/AppError");
const zodErrorHandler_1 = __importDefault(require("../utils/zodErrorHandler"));
const errorCodes_1 = require("../utils/errors/errorCodes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler = (err, _req, res, _next) => {
    console.log(err);
    if (res.headersSent) {
        return _next(err);
    }
    if (err instanceof AppError_1.AppError) {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            success: err.success,
            error: err.error,
            message: err.message,
            errorType: err.errorType,
            data: err.data,
        });
        return;
    }
    if (err instanceof zod_1.ZodError) {
        const zodError = (0, zodErrorHandler_1.default)(err);
        res.status(400).json({
            status: 'error',
            code: errorCodes_1.ErrorCode.VALIDATION_ERROR,
            message: zodError,
            errorType: "Zod_Error",
            details: { data: null }
        });
        return;
    }
    if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
        res.status(401).json({
            status: 'error',
            code: errorCodes_1.ErrorCode.TOKEN_EXPIRED,
            message: 'Your authentication token has expired. Please log in again.',
            errorType: "Token_Expired_Error"
        });
        return;
    }
    if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
        res.status(403).json({
            status: 'error',
            code: errorCodes_1.ErrorCode.INVALID_TOKEN,
            message: 'The authentication token is invalid.',
            errorType: "Invalid_Token_Error"
        });
        return;
    }
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        code: 'INTERNAL_SERVER_ERROR',
        details: null,
        errorType: "Server_Error",
    });
};
exports.default = errorHandler;
