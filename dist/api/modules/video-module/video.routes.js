"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const video_controller_1 = require("./video.controller");
const authenticateAdmin_1 = require("@/core/middleware/auth/authenticateAdmin");
const authenticateStudent_1 = require("@/core/middleware/auth/authenticateStudent");
const videoRouter = express_1.default.Router();
videoRouter.post("/video/create", authenticateAdmin_1.authenticateAdmin, video_controller_1.VideoController.createVideo);
videoRouter.get("/video/all", authenticateAdmin_1.authenticateAdmin, video_controller_1.VideoController.getAllVideos);
videoRouter.get("/student/lesson/videos", authenticateStudent_1.authenticateStudent, video_controller_1.VideoController.getAllVideosByLessonId);
videoRouter.get("/student/video", authenticateStudent_1.authenticateStudent, video_controller_1.VideoController.getVideoById);
exports.default = videoRouter;
