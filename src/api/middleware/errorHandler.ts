import { ZodError } from "zod";
import { AppError } from "../../utils/errors/AppError";
import { Request, Response, NextFunction } from 'express';
import handleZodError from "../../utils/zodErrorHandler";
import { ErrorCode } from "../../utils/errors/errorCodes";
import jwt from "jsonwebtoken";  // Import the entire jsonwebtoken module

interface ErrorWithDetails {
  code?: string;
  status?: number;
  message?: string;
  details?: unknown;
}

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  console.log(err)

  // Check if a response has already been sent
  if (res.headersSent) {
    return _next(err);
  }

  if (err instanceof AppError) {
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

  if (err instanceof ZodError) {
    const zodError = handleZodError(err)

    res.status(400).json({
      status: 'error',
      code: ErrorCode.VALIDATION_ERROR,
      message: zodError,
      errorType: "Zod_Error",
      details: { data: null }
    });
    return;
  }

  if (err instanceof jwt.TokenExpiredError) {
    res.status(401).json({
      status: 'error',
      code: ErrorCode.TOKEN_EXPIRED,
      message: 'Your authentication token has expired. Please log in again.',
      errorType: "Token_Expired_Error"
    });
    return;
  }

  if (err instanceof jwt.JsonWebTokenError) {
    res.status(403).json({
      status: 'error',
      code: ErrorCode.INVALID_TOKEN,
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

export default errorHandler;