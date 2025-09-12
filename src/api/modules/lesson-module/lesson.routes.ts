import express from "express";
import { LessonController } from "./lesson.controller";
import { authenticateStudent } from "../../../core/middleware/auth/authenticateStudent";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";
import { isSubscribed } from "../../../core/middleware/isSubscribed";

const lessonRouter = express.Router();

// Admin routes
lessonRouter.post("/lesson/create", authenticateAdmin, LessonController.createLesson);
lessonRouter.get("/lesson/all", authenticateAdmin, LessonController.getAllLessons);
lessonRouter.get("/lesson/:id", authenticateAdmin, LessonController.getLessonById);

// Student routes - protected by subscription
lessonRouter.get("/student/chapter/lessons", authenticateStudent, isSubscribed, LessonController.getLessonByChapterId);

export default lessonRouter