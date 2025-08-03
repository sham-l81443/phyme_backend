"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const rethrowError_1 = require("@/core/utils/errors/rethrowError");
const video_validation_1 = require("./video.validation");
const utils_1 = require("@/core/utils");
const video_repository_1 = require("./video.repository");
class VideoService {
    static async createVideoService(data) {
        try {
            const validatedData = (0, utils_1.validateDto)(video_validation_1.VideoValidation.createVideo, data);
            const video = await video_repository_1.VideoRepository.createVideo({
                name: validatedData.name,
                description: validatedData.description,
                embedLink: validatedData.embedLink,
                duration: validatedData.duration,
                code: validatedData.code,
                thumbnail: validatedData.thumbnail,
                lessonId: validatedData.lessonId,
            });
            return video;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to create new folder');
        }
    }
    static async getAllVideos() {
        try {
            const videos = await video_repository_1.VideoRepository.getAllVideos();
            return videos;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to fetch videos');
        }
    }
    static async getAllVideosByLessonId(lessonId) {
        try {
            const videos = await video_repository_1.VideoRepository.getAllVideosByLessonId(lessonId);
            return videos;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to fetch videos');
        }
    }
    static async getVideoById(id) {
        try {
            const video = await video_repository_1.VideoRepository.getVideoById(id);
            return video;
        }
        catch (error) {
            (0, rethrowError_1.rethrowAppError)(error, 'Failed to fetch video');
        }
    }
}
exports.VideoService = VideoService;
