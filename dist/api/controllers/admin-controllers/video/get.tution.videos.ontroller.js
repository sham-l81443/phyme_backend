"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const video_repository_1 = require("@/api/repositories/video.repository");
const getLiveVideos = async (req, res, next) => {
    try {
        const allVideos = await video_repository_1.videoRepository.getAllTutionVideos();
        const responseBody = (0, responseCreator_1.default)({ data: allVideos, message: 'success' });
        res.status(200).json(responseBody);
    }
    catch (error) {
        next(error);
    }
};
exports.default = getLiveVideos;
