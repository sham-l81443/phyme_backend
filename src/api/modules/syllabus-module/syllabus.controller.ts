import { Request, Response, NextFunction } from "express";
import { SyllabusService } from "./syllabus.service";
import createSuccessResponse from "../../../core/utils/responseCreator";

export class SyllabusController{


    static async createSyllabus(req: Request, res: Response, next: NextFunction) {
        
        try {
            
            const newSyllabus = await SyllabusService.createSyllabusService(req?.body)

            const responseData = createSuccessResponse({ data: newSyllabus, message: 'Syllabus created successfully' })

            res.status(201).json(responseData)


        } catch (error) {

            next(error)
        }
        
    }


    static async getAllSyllabus(req: Request, res: Response, next: NextFunction) {

        try {
           
            const allSyllabus = await SyllabusService.getAllSyllabusService()

            const responseData = createSuccessResponse({ data: allSyllabus, message: 'All syllabus fetched successfully' })

            res.status(200).json(responseData)
            
        } catch (error) {
            next(error)
        }

    }

    static async updateSyllabus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updatedSyllabus = await SyllabusService.updateSyllabusService(id, req.body);

            const responseData = createSuccessResponse({ 
                data: updatedSyllabus, 
                message: 'Syllabus updated successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }

    static async deleteSyllabus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await SyllabusService.deleteSyllabusService(id);

            const responseData = createSuccessResponse({ 
                data: null, 
                message: 'Syllabus deleted successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }


}