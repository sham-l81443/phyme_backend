import express from "express";
import { LessonController } from "./lesson.controller";
import { authenticateStudent } from "../../../core/middleware/auth/authenticateStudent";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";

const lessonRouter = express.Router();

lessonRouter.post("/lesson/create", LessonController.createLesson);
lessonRouter.get("/lesson/all", LessonController.getAllLessons);
lessonRouter.get("/lesson/:id", LessonController.getLessonById);
lessonRouter.get("/student/chapter/lessons",authenticateStudent, LessonController.getLessonByChapterId);


export default lessonRouter