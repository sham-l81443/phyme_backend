"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lesson_controller_1 = require("./lesson.controller");
const authenticateStudent_1 = require("../../../core/middleware/auth/authenticateStudent");
const lessonRouter = express_1.default.Router();
lessonRouter.post("/lesson/create", lesson_controller_1.LessonController.createLesson);
lessonRouter.get("/lesson/all", lesson_controller_1.LessonController.getAllLessons);
lessonRouter.get("/student/chapter/lessons", authenticateStudent_1.authenticateStudent, lesson_controller_1.LessonController.getLessonByChapterId);
exports.default = lessonRouter;
