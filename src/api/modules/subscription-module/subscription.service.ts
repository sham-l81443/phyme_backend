import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { SubscriptionRepository } from "./subscription.repository";
import { validateDto } from "../../../core/utils/dto/validateData";
import { SubscriptionValidation } from "./subscription.validation";



export class SubscriptionService {
    

    static async createSubscriptionService(body:any) {
     
        try {
            
            const validateData = validateDto(SubscriptionValidation.createSubscriptionSchema,body)

            const subscription = await SubscriptionRepository.createSubscription(validateData)

            return subscription
            
        }catch(error){
         
            rethrowAppError(error,'Failed to create new subscription')
            
        }
        
    }


    // get user subscription
    static async getUserSubscriptionService(userId:string){
        try {
            const subscription = await SubscriptionRepository.getUserSubscription(userId)
            return subscription
        } catch (error) {
            rethrowAppError(error,'Failed to get user subscription')
        }
    }

}

