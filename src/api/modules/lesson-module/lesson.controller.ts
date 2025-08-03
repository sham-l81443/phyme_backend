
import { Request, Response, NextFunction } from "express";
import createSuccessResponse from "@/core/utils/responseCreator";
import { LessonService } from "./lesson.service";

export class LessonController {
  static async getAllLessons(req: Request, res: Response, next: NextFunction) {
    try {
      const lessons = await LessonService.getAllLessons();
      const responseData = createSuccessResponse({ data: lessons, message: "Lessons fetched successfully" });
      res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  }

  static async createLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await LessonService.createLesson(req.body);
      const responseData = createSuccessResponse({ data: lesson, message: "Lesson created successfully" });
      res.status(201).json(responseData);
    } catch (error) {
      next(error);
    }
  }


  static async getLessonByChapterId(req: Request, res: Response, next: NextFunction) {
    console.log(req.query)
    try {
      const lesson = await LessonService.getLessonByChapterId(req.query?.chapterId as string);
      const responseData = createSuccessResponse({ data: lesson, message: "Lesson fetched successfully" });
      res.status(200).json(responseData);
    } catch (error) {
      next(error);
    }
  }
}
