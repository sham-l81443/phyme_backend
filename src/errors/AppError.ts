import { ErrorCode } from "./errorCodes";

export class AppError extends Error {
    errorType: "Bad Request" | "Unauthorized" | "Forbidden" | "Not Found" | "Internal Server Error";
    success: boolean;
    error: boolean;
    data: unknown;
    statusCode: 400 | 401 | 404 | 403 | 500;
    constructor(
        {
            message,
            statusCode,
            errorType,
            data
        }: {

            message: string,
            statusCode: 400 | 401 | 404 | 403 | 500,
            errorType: "Bad Request" | "Unauthorized" | "Forbidden" | "Not Found" | "Internal Server Error",
            data?: unknown,
        }

    ) {

        super(message)
        this.statusCode = statusCode;
        this.error = true;
        this.success = false;
        this.errorType = errorType;
        this.data = data;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }
}