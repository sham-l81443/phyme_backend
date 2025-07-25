

export enum ErrorCode {
    // Authentication Errors
    EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    OTP_SEND_FAILURE = 'OTP_SEND_FAILURE',
    OTP_VERIFICATION_FAILED = 'OTP_VERIFICATION_FAILED',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',

    // Network & Request Errors
    BAD_REQUEST = 'BAD_REQUEST',
    NOT_FOUND = 'NOT_FOUND',

    // Validation Errors
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',

    INVALID_TOKEN = "TOKEN_ERROR",
    TOKEN_EXPIRED = "TOKEN_ERROR",
    // Database Errors
    DATABASE_ERROR = 'DATABASE_ERROR',
    DUPLICATE_RECORD = 'DUPLICATE_RECORD',

    // Server Errors
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

    // Generic Error
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'

}