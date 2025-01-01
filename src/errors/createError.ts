import { statusCode } from "./statusCode";



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

export default function createErrorObject({ errorType, data = null, message }: IError): ErrorResponse {

    switch (errorType) {

        case "Bad Request":
            return {
                message: message || "The request is malformed or contains invalid parameters",
                statusCode: 400,
                errorType,
                data,

            };

        case "Unauthorized":
            return {
                message: message || "Authentication is required, or credentials are invalid",
                statusCode: 401,
                errorType,
                data,

            };

        case "Forbidden":
            return {
                message: message || "The user is authenticated but does not have permission to access the resource",
                statusCode: 403,
                errorType,
                data,

            };

        case "Not Found":
            return {
                message: message || "The requested resource does not exist",
                statusCode: 404,
                errorType,
                data,
            };

        default:
            return {
                message: message || "An unexpected error occurred",
                statusCode: 500,
                errorType,
                data,

            }
    }


}

