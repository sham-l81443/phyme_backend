import { Request, Response, NextFunction } from "express";
import { TermService } from "./term.service";
import createSuccessResponse from "@/core/utils/responseCreator";

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
}