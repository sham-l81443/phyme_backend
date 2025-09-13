import { Request, Response, NextFunction } from "express";
import { TermService } from "./term.service";
import createSuccessResponse from "../../../core/utils/responseCreator";
import { IStudentAccessToken } from "../../../core/schema";

export class TermController{


    static async createTermController(req: Request, res: Response, next: NextFunction) {
        
        try {

            const newTerm = await TermService.createTermService(req.body)

            const responseData = createSuccessResponse({ data: newTerm, message: 'Term created successfully' })

            res.status(201).json(responseData)
            
        }catch(error){

            next(error)
        
        }
    }


    static async getAllTermController(req: Request, res: Response, next: NextFunction) {
        try {


            const allTerms = await TermService.getAllTermService()
            const responseData = createSuccessResponse({ data: allTerms, message: 'All terms fetched successfully' })
            res.status(200).json(responseData)
        } catch (error) {
            next(error)
        }
    }


    static async getTermByClassId(req: Request, res: Response, next: NextFunction) {
        try {
            const {classId, id: studentId} = req.user as IStudentAccessToken

            const allTerms = await TermService.getAllTermServiceByClassId(classId, studentId)

            const responseData = createSuccessResponse({ data: allTerms, message: 'All terms fetched successfully' })

            res.status(200).json(responseData)

        } catch (error) {
            next(error)
        }
    }

    static async updateTermController(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updatedTerm = await TermService.updateTermService(id, req.body);

            const responseData = createSuccessResponse({ 
                data: updatedTerm, 
                message: 'Term updated successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }

    static async deleteTermController(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await TermService.deleteTermService(id);

            const responseData = createSuccessResponse({ 
                data: null, 
                message: 'Term deleted successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }


    
}