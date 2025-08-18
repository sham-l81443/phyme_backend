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
            const {classId} = req.user as IStudentAccessToken

            const allTerms = await TermService.getAllTermServiceByClassId(classId)

            const responseData = createSuccessResponse({ data: allTerms, message: 'All terms fetched successfully' })

            res.status(200).json(responseData)

        } catch (error) {
            
            next(error)
        }
    }


    
}