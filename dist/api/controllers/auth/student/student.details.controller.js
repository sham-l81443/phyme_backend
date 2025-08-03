"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const AppError_1 = require("@/core/utils/errors/AppError");
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const studentDetailsController = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError_1.AppError({
                errorType: 'Unauthorized',
                message: 'User not authenticated',
            });
        }
        const user = req.user;
        const userData = await prisma_1.default.user.findUnique({
            where: { id: user.id },
        });
        if (!userData) {
            throw new AppError_1.AppError({
                errorType: 'Not Found',
                message: 'User not found',
            });
        }
        const successObj = (0, responseCreator_1.default)({
            data: userData,
            code: 200,
            message: "User details retrieved successfully"
        });
        res.status(200).json(successObj);
    }
    catch (e) {
        console.error("Error in student.details.controller.ts:", e);
        next(e);
    }
};
exports.default = studentDetailsController;
