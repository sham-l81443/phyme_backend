"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
const video_service_1 = require("./video.service");
const responseCreator_1 = __importDefault(require("../../../core/utils/responseCreator"));
const AppError_1 = require("../../../core/utils/errors/AppError");
class VideoController {
    static async createVideo(req, res, next) {
        try {
            const video = await video_service_1.VideoService.createVideoService(req.body);
            const response = (0, responseCreator_1.default)({ data: video, message: "Video created successfully" });
            res.status(201).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllVideos(req, res, next) {
        try {
            const videos = await video_service_1.VideoService.getAllVideos();
            const response = (0, responseCreator_1.default)({ data: videos, message: "Videos fetched successfully" });
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async getAllVideosByLessonId(req, res, next) {
        var _a;
        try {
            console.log(req.query);
            const videos = await video_service_1.VideoService.getAllVideosByLessonId((_a = req.query) === null || _a === void 0 ? void 0 : _a.lessonId);
            const response = (0, responseCreator_1.default)({ data: videos, message: "Videos fetched successfully" });
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    static async getVideoById(req, res, next) {
        var _a;
        try {
            const video = await video_service_1.VideoService.getVideoById((_a = req.query) === null || _a === void 0 ? void 0 : _a.videoId);
            if (!video) {
                throw new AppError_1.AppError({ message: "Video not found", errorType: "Not Found" });
            }
            video.embedLink = video.embedLink.split('').reverse().join('');
            const response = (0, responseCreator_1.default)({ data: video, message: "Video fetched successfully" });
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.VideoController = VideoController;
