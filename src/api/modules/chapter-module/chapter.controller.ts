import createSuccessResponse from "@/core/utils/responseCreator";
import { Request, Response, NextFunction } from "express";
import { ChapterService } from "./chapter.service";

export class ChapterController {

    static async getAllChapters(req: Request, res: Response, next: NextFunction) {

        try {

            const allChapters = await ChapterService.findAll()

            const responseData = createSuccessResponse({ data: allChapters, message: 'Chapters fetched successfully' })

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }

    }

    static async createChapterController(req: Request, res: Response, next: NextFunction) {

        try {

            const newChapter = await ChapterService.createChapterService(req.body)

            const responseData = createSuccessResponse({ data: newChapter, message: 'Chapter created successfully' })

            res.status(201).json(responseData)

        } catch (error) {
            next(error)
        }

    }

}