import express from "express";
import { VideoController } from "./video.controller";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";
import { authenticateStudent } from "../../../core/middleware/auth/authenticateStudent";
import { isSubscribed } from "../../../core/middleware/isSubscribed";

const videoRouter = express.Router();

// Admin routes
videoRouter.post("/video/create", authenticateAdmin, VideoController.createVideo);
videoRouter.get("/video/all", authenticateAdmin, VideoController.getAllVideos);

// Student routes - protected by subscription
videoRouter.get("/student/lesson/videos", authenticateStudent, isSubscribed, VideoController.getAllVideosByLessonId);
videoRouter.get("/student/video", authenticateStudent, isSubscribed, VideoController.getVideoById);

export default videoRouter