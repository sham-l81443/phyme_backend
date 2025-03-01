import { statusCode } from "../errors/statusCode";



interface IError {
    errorType: "Bad Request" | "Unauthorized" | "Forbidden" | "Not Found" | "Internal Server Error";
    message?: string;
    data?: any
}


type ErrorResponse = {
    message: string;
    statusCode: 400 | 401 | 403 | 404 | 500;
    errorType: "Bad Request" | "Unauthorized" | "Forbidden" | "Not Found" | "Internal Server Error";
    data?: unknown;
};

const STATUS_CODES = {
    "Bad Request": 400,
    "Unauthorized": 401,
    "Forbidden": 403,
    "Not Found": 404,
    "Internal Server Error": 500
} as const;

const ERROR_MESSAGES: Record<IError["errorType"], string> = {
    "Bad Request": "The request is malformed or contains invalid parameters",
    "Unauthorized": "Authentication is required, or credentials are invalid",
    "Forbidden": "The user is authenticated but does not have permission to access the resource",
    "Not Found": "The requested resource does not exist",
    "Internal Server Error": "An unexpected error occurred"
};

export default function createErrorObject({ errorType, data = null, message }: IError): ErrorResponse {
    return {
        message: message || ERROR_MESSAGES[errorType],
        statusCode: STATUS_CODES[errorType],
        errorType,
        data,
    };
}

