import express from "express";
import { LessonController } from "./lesson.controller";
import { authenticateStudent } from "@/core/middleware/auth/authenticateStudent";

const lessonRouter = express.Router();

lessonRouter.post("/lesson/create", LessonController.createLesson);
lessonRouter.get("/lesson/all", LessonController.getAllLessons);
lessonRouter.get("/student/chapter/lessons",authenticateStudent, LessonController.getLessonByChapterId);


export default lessonRouter