"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonController = void 0;
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const lesson_service_1 = require("./lesson.service");
class LessonController {
    static async getAllLessons(req, res, next) {
        try {
            const lessons = await lesson_service_1.LessonService.getAllLessons();
            const responseData = (0, responseCreator_1.default)({ data: lessons, message: "Lessons fetched successfully" });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async createLesson(req, res, next) {
        try {
            const lesson = await lesson_service_1.LessonService.createLesson(req.body);
            const responseData = (0, responseCreator_1.default)({ data: lesson, message: "Lesson created successfully" });
            res.status(201).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
    static async getLessonByChapterId(req, res, next) {
        var _a;
        console.log(req.query);
        try {
            const lesson = await lesson_service_1.LessonService.getLessonByChapterId((_a = req.query) === null || _a === void 0 ? void 0 : _a.chapterId);
            const responseData = (0, responseCreator_1.default)({ data: lesson, message: "Lesson fetched successfully" });
            res.status(200).json(responseData);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LessonController = LessonController;
