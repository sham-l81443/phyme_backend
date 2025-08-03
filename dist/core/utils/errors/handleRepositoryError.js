"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRepositoryError = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../logger");
const AppError_1 = require("./AppError");
const handleRepositoryError = (error) => {
    if (error instanceof AppError_1.AppError) {
        throw error;
    }
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        logger_1.logger.error('PRISMA', error);
        if (error.code === 'P2002') {
            throw new AppError_1.AppError({ message: 'Conflict: Video already exists with same unique id already exist', errorType: 'Conflict' });
        }
        if (error.code === 'P2003') {
            throw new AppError_1.AppError({ message: 'prisma error: something went wrong', errorType: 'Bad Request' });
        }
        if (error.code === 'P2025') {
            throw new AppError_1.AppError({ message: 'Not Found', errorType: 'Not Found' });
        }
    }
    logger_1.logger.error('DEFAULT', error);
    throw new AppError_1.AppError({ message: 'Internal Server Error', errorType: 'Internal Server Error' });
};
exports.handleRepositoryError = handleRepositoryError;
