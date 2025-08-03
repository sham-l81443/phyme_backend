"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = require("@/core/utils/errors/AppError");
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const getLiveClassByIdController = async (req, res, next) => {
    try {
        const user = req.user;
        ``;
        const video = await prisma_1.default.video.findUnique({ where: { id: req.params.videoId }, });
        if (!video) {
            throw new AppError_1.AppError({ message: 'Video not found', errorType: 'Not Found' });
        }
        if ((video === null || video === void 0 ? void 0 : video.isFree) === false && user.role === 'FREE') {
            throw new AppError_1.AppError({ message: 'This video is only available for premium users', errorType: 'Forbidden' });
        }
        video.embedLink = video.embedLink.split('').reverse().join('');
        const responseBody = (0, responseCreator_1.default)({ data: video, message: 'success' });
        res.status(200).json(responseBody);
    }
    catch (error) {
        next(error);
    }
};
exports.default = getLiveClassByIdController;
