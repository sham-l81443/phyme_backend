"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const AppError_1 = require("@/core/utils/errors/AppError");
const rethrowError_1 = require("@/core/utils/errors/rethrowError");
const user_validation_1 = require("./user.validation");
class UserServices {
    static async getUserById({ id }) {
        try {
            const validatedData = user_validation_1.UserValidation.validateIdSchema.safeParse({ id });
            if (!validatedData.success) {
                throw new AppError_1.AppError({ errorType: 'Bad Request', message: 'Invalid request body', data: validatedData.error });
            }
            const user = await prisma_1.default.user.findUnique({ where: { id: validatedData.data.id } });
            if (!user) {
                throw new AppError_1.AppError({ errorType: 'Not Found', message: 'User not found' });
            }
            return user;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to get user');
        }
    }
    static async updateUserById({ id, data }) {
        try {
            const validatedData = user_validation_1.UserValidation.validateIdSchema.safeParse({ id });
            if (!validatedData.success) {
                throw new AppError_1.AppError({ errorType: 'Bad Request', message: 'Invalid request body', data: validatedData.error });
            }
            const user = await prisma_1.default.user.update({ where: { id: validatedData.data.id }, data: data });
            if (!user) {
                throw new AppError_1.AppError({ errorType: 'Not Found', message: 'User not found' });
            }
            return user;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to update user');
        }
    }
    static async getAllUserService() {
        try {
            return await prisma_1.default.user.findMany({
                include: {
                    class: true,
                    syllabus: true,
                }
            });
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to get all users');
        }
    }
}
exports.UserServices = UserServices;
