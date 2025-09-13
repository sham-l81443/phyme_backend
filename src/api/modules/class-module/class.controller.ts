import createSuccessResponse from "../../../core/utils/responseCreator";
import { Request, Response, NextFunction } from "express";
import { ClassService } from "./class.service";

export class ClassController {


    static async createClassController(req: Request, res: Response, next: NextFunction) {

        try {

            const newClass = await ClassService.createClassService({ body: req.body })

            const responseData = createSuccessResponse({ data: newClass, message: 'Class created successfully' })

            res.status(201).json(responseData)

        } catch (error) {

            next(error)
        }

    }

    static async getAllClassController(req: Request, res: Response, next: NextFunction) {

        try {

            const allClasses = await ClassService.getAllClassService()

            const responseData = createSuccessResponse({ data: allClasses, message: 'All classes fetched successfully' })

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }

    }

    static async getClassBySyllabusController(req: Request, res: Response, next: NextFunction) {

        try {
            const classes = await ClassService.getClassBySyllabusService({ body: req.params })

            const responseData = createSuccessResponse({ data: classes, message: 'Classes fetched successfully' })

            res.status(200).json(responseData)

        } catch (error) {

            next(error)

        }
    }

    static async updateClassController(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updatedClass = await ClassService.updateClassService(id, req.body);

            const responseData = createSuccessResponse({ 
                data: updatedClass, 
                message: 'Class updated successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }

    static async deleteClassController(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await ClassService.deleteClassService(id);

            const responseData = createSuccessResponse({ 
                data: null, 
                message: 'Class deleted successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }
}

