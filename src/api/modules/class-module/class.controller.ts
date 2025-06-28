import createSuccessResponse from "@/core/utils/responseCreator";
import { Request, Response, NextFunction } from "express";
import { ClassService } from "./class.service";

export class ClassController{


    static async createClassController(req: Request, res: Response, next: NextFunction) {

        try {

          const newClass = await ClassService.createClassService({body:req.body})

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

}