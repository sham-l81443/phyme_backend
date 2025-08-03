"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const getAllLiveClassUserController = async (req, res, next) => {
    try {
        const user = req.user;
        const allVideos = await prisma_1.default.video.findMany({ where: { videoType: 'TUTION' }, orderBy: { createdAt: 'desc' }, omit: { embedLink: true } });
        if (!allVideos) {
            res.status(404).json((0, responseCreator_1.default)({ data: [], message: 'success', success: true }));
        }
        const responseBody = (0, responseCreator_1.default)({ data: allVideos, message: 'success', success: true, meta: { isLocked: user.role === "FREE" ? true : false } });
        res.status(200).json(responseBody);
    }
    catch (error) {
        next(error);
    }
};
exports.default = getAllLiveClassUserController;
