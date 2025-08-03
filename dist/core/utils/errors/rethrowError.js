"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rethrowAppError = rethrowAppError;
const AppError_1 = require("./AppError");
function rethrowAppError(error, fallbackMessage) {
    if (error instanceof AppError_1.AppError)
        throw error;
    console.error(fallbackMessage + ":", error instanceof Error ? error.message : "Unknown error");
    throw new AppError_1.AppError({
        errorType: "Internal Server Error",
        message: fallbackMessage,
    });
}
