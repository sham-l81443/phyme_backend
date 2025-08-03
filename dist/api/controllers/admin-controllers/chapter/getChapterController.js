"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("@/core/utils/errors/AppError");
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const getChaptersController = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError_1.AppError({ errorType: 'Unauthorized', message: 'User not found' });
        }
        const adminId = req.user.userId;
        if (!adminId) {
            throw new AppError_1.AppError({ errorType: 'Unauthorized', message: 'User not found' });
        }
        const admin = await prisma_1.default.admin.findFirst({
            where: {
                id: adminId
            },
            include: {
                chapters: true
            }
        });
        if (!admin) {
            throw new AppError_1.AppError({ errorType: 'Unauthorized', message: 'Admin not found' });
        }
        const resObj = (0, responseCreator_1.default)({
            message: "Chapters fetched successfully",
            data: admin.chapters
        });
        res.status(200).json(resObj);
        return;
    }
    catch (e) {
        next(e);
    }
};
exports.default = getChaptersController;
