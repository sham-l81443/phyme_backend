import createSuccessResponse from "../../../core/utils/responseCreator";
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

    // get chapter by term id and subject id
    static async getChapterByTermIdAndSubjectId(req: Request, res: Response, next: NextFunction) {

        try {
            console.log(req.query)

            
            const chapter = await ChapterService.findByTermIdAndSubjectId(req.query)

            const responseData = createSuccessResponse({ data: chapter, message: 'Chapter fetched successfully' })

            res.status(200).json(responseData)

        } catch (error) {

            next(error)

        }

    }

    static async updateChapterController(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updatedChapter = await ChapterService.updateChapterService(id, req.body);

            const responseData = createSuccessResponse({ 
                data: updatedChapter, 
                message: 'Chapter updated successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }

    static async deleteChapterController(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await ChapterService.deleteChapterService(id);

            const responseData = createSuccessResponse({ 
                data: null, 
                message: 'Chapter deleted successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }

}