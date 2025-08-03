import { rethrowAppError } from "../../../core/utils/errors/rethrowError";


import { LessonRepository } from "./lesson.repository";

export class LessonService {
  static async getAllLessons() {
    return await LessonRepository.findAll();
  }

  static async createLesson(data: {
    name: string;
    code: string;
    chapterId: string;
    description?: string;
  }) {
    return await LessonRepository.createLesson(data);
  }


  static async getLessonByChapterId(chapterId: string) {
    return await LessonRepository.getLessonByChapterId(chapterId);
  }
}
