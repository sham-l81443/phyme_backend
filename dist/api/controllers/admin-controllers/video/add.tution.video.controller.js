"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addLiveVideoController;
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const utils_1 = require("@/core/utils");
const video_schema_1 = require("@/core/schema/video.schema");
const video_repository_1 = require("@/api/repositories/video.repository");
async function addLiveVideoController(req, res, next) {
    try {
        const validatedData = (0, utils_1.validateDto)(video_schema_1.CreateVideoSchema, req.body);
        const newVideo = await video_repository_1.videoRepository.createVideo(validatedData);
        const resData = (0, responseCreator_1.default)({
            data: newVideo,
            message: 'Video added successfully',
        });
        res.status(201).json(resData);
    }
    catch (error) {
        next(error);
    }
}
