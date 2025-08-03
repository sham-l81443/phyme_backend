import express from "express";
import { VideoController } from "./video.controller";
import { authenticateAdmin } from "@/core/middleware/auth/authenticateAdmin";
import { authenticateStudent } from "@/core/middleware/auth/authenticateStudent";

const videoRouter = express.Router();

videoRouter.post("/video/create", authenticateAdmin, VideoController.createVideo);
videoRouter.get("/video/all",authenticateAdmin, VideoController.getAllVideos);
videoRouter.get("/student/lesson/videos",authenticateStudent, VideoController.getAllVideosByLessonId);
videoRouter.get("/student/video",authenticateStudent, VideoController.getVideoById);


export default videoRouter