import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "./subscription.service";
import createSuccessResponse from "../../../core/utils/responseCreator";
import { IStudentAccessToken } from "../../../core/schema";

export class SubscriptionController{

static async createSubscriptionController(req: Request, res: Response, next: NextFunction) {
 
    try {
        
        const newSubscription = await SubscriptionService.createSubscriptionService(req.body)

        const responseData = createSuccessResponse({ data: newSubscription, message: 'Subscription created successfully' })

        res.status(201).json(responseData)
        

    }catch(error){

        next(error)
    }
    
}

// get user subscription
static async getUserSubscriptionController(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user as IStudentAccessToken
        const subscription = await SubscriptionService.getUserSubscriptionService(user?.id)
        const responseData = createSuccessResponse({ data: subscription, message: 'Subscription fetched successfully' })
        res.status(200).json(responseData)
    } catch (error) {
        next(error)
    }
}
    
}