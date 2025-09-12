import express from "express";
import { ChapterController } from "./chapter.controller";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";
import { authenticateStudent } from "../../../core/middleware/auth/authenticateStudent";
import { isSubscribed } from "../../../core/middleware/isSubscribed";

const ChapterRouter = express.Router();

// Admin routes
ChapterRouter.get('/chapter/all', authenticateAdmin, ChapterController.getAllChapters)
ChapterRouter.post('/chapter/create', authenticateAdmin, ChapterController.createChapterController)

// Student routes - protected by subscription
ChapterRouter.get('/student/chapters', authenticateStudent, isSubscribed, ChapterController.getChapterByTermIdAndSubjectId)

export default ChapterRouter