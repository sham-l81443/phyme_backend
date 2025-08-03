"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonService = void 0;
const lesson_repository_1 = require("./lesson.repository");
class LessonService {
    static async getAllLessons() {
        return await lesson_repository_1.LessonRepository.findAll();
    }
    static async createLesson(data) {
        return await lesson_repository_1.LessonRepository.createLesson(data);
    }
    static async getLessonByChapterId(chapterId) {
        return await lesson_repository_1.LessonRepository.getLessonByChapterId(chapterId);
    }
}
exports.LessonService = LessonService;
