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

    static async updateSubjectController(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updatedSubject = await SubjectService.updateSubjectService(id, req.body);

            const responseData = createSuccessResponse({ 
                data: updatedSubject, 
                message: 'Subject updated successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }

    static async deleteSubjectController(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await SubjectService.deleteSubjectService(id);

            const responseData = createSuccessResponse({ 
                data: null, 
                message: 'Subject deleted successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }
}
