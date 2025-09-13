import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { AppError } from "../../../core/utils/errors/AppError";

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

  static async getLessonById(id: string) {
    return await LessonRepository.getLessonById(id);
  }

  static async updateLessonService(id: string, body: any) {
    try {
      // Check if lesson exists
      const existingLesson = await LessonRepository.findById(id);
      if (!existingLesson) {
        throw new AppError({ errorType: "Not Found", message: "Lesson not found" });
      }

      // Validate the update data (assuming we have validation schema)
      const validatedData = body; // You might want to add validation here

      return await LessonRepository.update(id, validatedData);

    } catch (error) {
      rethrowAppError(error, 'Failed to update lesson');
    }
  }

  static async deleteLessonService(id: string) {
    try {
      // Check if lesson exists
      const existingLesson = await LessonRepository.findById(id);
      if (!existingLesson) {
        throw new AppError({ errorType: "Not Found", message: "Lesson not found" });
      }

      // Check if lesson has associated videos, pdfs, or quizzes
      if (existingLesson._count.videos > 0) {
        throw new AppError({ 
          errorType: "Conflict", 
          message: "Cannot delete lesson with associated videos" 
        });
      }

      if (existingLesson._count.pdfs > 0) {
        throw new AppError({ 
          errorType: "Conflict", 
          message: "Cannot delete lesson with associated PDFs" 
        });
      }

      if (existingLesson._count.quizzes > 0) {
        throw new AppError({ 
          errorType: "Conflict", 
          message: "Cannot delete lesson with associated quizzes" 
        });
      }

      return await LessonRepository.delete(id);

    } catch (error) {
      rethrowAppError(error, 'Failed to delete lesson');
    }
  }
}
