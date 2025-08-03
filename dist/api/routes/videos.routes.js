"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const constants_1 = require("./constants");
const authenticateStudent_1 = require("../../core/middleware/auth/authenticateStudent");
const tution_videos_controller_1 = __importDefault(require("../controllers/student-controllers/tution/tution.videos.controller"));
const authenticateAdmin_1 = require("../../core/middleware/auth/authenticateAdmin");
const add_tution_video_controller_1 = __importDefault(require("../controllers/admin-controllers/video/add.tution.video.controller"));
const videosRouter = (0, express_1.Router)();
videosRouter.get(constants_1.STUDENT_ENDPOINTS.tutionVideos, authenticateStudent_1.authenticateStudent, tution_videos_controller_1.default);
videosRouter.post(constants_1.ADMIN_ENDPOINTS.createVideo, authenticateAdmin_1.authenticateAdmin, add_tution_video_controller_1.default);
exports.default = videosRouter;
