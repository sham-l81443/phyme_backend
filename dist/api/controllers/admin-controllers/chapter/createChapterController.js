"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("@/core/utils/errors/AppError");
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const chapterSchema_1 = require("@/core/schema/chapterSchema");
const createChapterController = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new AppError_1.AppError({ errorType: 'Unauthorized', message: 'User not found' });
        }
        const adminId = req.user.userId;
        if (!adminId) {
            throw new AppError_1.AppError({ errorType: 'Unauthorized', message: 'User not found' });
        }
        const validatedData = chapterSchema_1.createChapterSchema.parse(req.body);
        const chapter = await prisma_1.default.chapter.create({
            data: {
                title: validatedData === null || validatedData === void 0 ? void 0 : validatedData.title,
                adminId: adminId,
                class: validatedData === null || validatedData === void 0 ? void 0 : validatedData.class,
                description: validatedData === null || validatedData === void 0 ? void 0 : validatedData.description
            },
            select: {
                class: true,
                description: true,
                title: true,
                createdAt: true,
                id: true,
                updatedAt: true,
            }
        });
        const resObj = (0, responseCreator_1.default)({
            message: "Chapter created successfully",
            data: chapter
        });
        res.status(201).json(resObj);
        return;
    }
    catch (e) {
        next(e);
    }
};
exports.default = createChapterController;
