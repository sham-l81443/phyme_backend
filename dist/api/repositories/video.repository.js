"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRepository = void 0;
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const AppError_1 = require("@/core/utils/errors/AppError");
const handleRepositoryError_1 = require("@/core/utils/errors/handleRepositoryError");
class videoRepository {
    static async getVideoByUniqueCode(code) {
        try {
            const uniqueVideo = await prisma_1.default.video.findUnique({
                where: { code: code }
            });
            if (!uniqueVideo) {
                throw new AppError_1.AppError({ message: "Video not found", errorType: "Not Found" });
            }
            return uniqueVideo;
        }
        catch (e) {
            (0, handleRepositoryError_1.handleRepositoryError)(e);
        }
    }
    static async createVideo(data) {
        try {
            const newVideo = await prisma_1.default.video.create({
                data: data,
            });
            return newVideo;
        }
        catch (e) {
            (0, handleRepositoryError_1.handleRepositoryError)(e);
        }
    }
    static async getAllTutionVideos() {
        try {
            const allVideos = await prisma_1.default.video.findMany({
                where: { videoType: 'TUTION' }
            });
            return allVideos;
        }
        catch (e) {
            (0, handleRepositoryError_1.handleRepositoryError)(e);
        }
    }
    static async deleteVideo(id) {
        try {
            const deletedVideo = await prisma_1.default.video.delete({
                where: { id: id }
            });
            return deletedVideo;
        }
        catch (e) {
            (0, handleRepositoryError_1.handleRepositoryError)(e);
        }
    }
}
exports.videoRepository = videoRepository;
