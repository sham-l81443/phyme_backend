import { Request, Response, NextFunction } from "express";
import { SubjectService } from "./subject.service";
import createSuccessResponse from "../../../core/utils/responseCreator";


export class SubjectController {

    static async createSubjectController(req: Request, res: Response, next: NextFunction) {


        try {

            const subject = await SubjectService.createSubjectService(req.body)

            const responseData = createSuccessResponse({ data: subject, message: 'Subject created successfully' })

            res.status(201).json(responseData)

        } catch (error) {

            next(error)
        }

    }

    static async getAllSubjectController(req: Request, res: Response, next: NextFunction) {

        try {
            const subjects = await SubjectService.getAllSubjectService()
            const responseData = createSuccessResponse({ data: subjects, message: 'Subjects fetched successfully' })
            res.status(200).json(responseData)
        } catch (error) {
            next(error)
        }
    }

    static async getSubjectsByClassIdController(req: Request, res: Response, next: NextFunction) {

        try {



            const subjects = await SubjectService.getSubjectsByClassIdService(req.user)

            const responseData = createSuccessResponse({ data: subjects, message: 'Subjects fetched successfully' })

            res.status(200).json(responseData)

        } catch (error) {

            next(error)

        }
    }
}
