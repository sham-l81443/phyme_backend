"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createErrorObject;
const STATUS_CODES = {
    "Bad Request": 400,
    "Unauthorized": 401,
    "Forbidden": 403,
    "Not Found": 404,
    "Internal Server Error": 500
};
const ERROR_MESSAGES = {
    "Bad Request": "The request is malformed or contains invalid parameters",
    "Unauthorized": "Authentication is required, or credentials are invalid",
    "Forbidden": "The user is authenticated but does not have permission to access the resource",
    "Not Found": "The requested resource does not exist",
    "Internal Server Error": "An unexpected error occurred"
};
function createErrorObject({ errorType, data = null, message }) {
    return {
        message: message || ERROR_MESSAGES[errorType],
        statusCode: STATUS_CODES[errorType],
        errorType,
        data,
    };
}
