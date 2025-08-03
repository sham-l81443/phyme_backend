"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = void 0;
const AppError_1 = require("../errors/AppError");
const rethrowError_1 = require("../errors/rethrowError");
const validateDto = (schema, data) => {
    try {
        if (!data) {
            throw new AppError_1.AppError({ errorType: 'Bad Request', message: 'Invalid request body' });
        }
        const result = schema.safeParse(data);
        if (!result.success) {
            throw new AppError_1.AppError({ errorType: 'Bad Request', data: result.error.issues.map((issue) => issue.message).join(', '), message: 'Invalid request body' });
        }
        return result.data;
    }
    catch (error) {
        (0, rethrowError_1.rethrowAppError)(error, 'Invalid request body ');
    }
};
exports.validateDto = validateDto;
