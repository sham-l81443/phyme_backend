import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { SubscriptionRepository } from "./subscription.repository";
import { validateDto } from "../../../core/utils/dto/validateData";
import { SubscriptionValidation } from "./subscription.validation";
import { SubscriptionUtils } from "../../../core/utils/subscriptionUtils";



export class SubscriptionService {
    

    static async createSubscriptionService(body:any) {
        try {
            const validateData = validateDto(SubscriptionValidation.createSubscriptionSchema, body)
            
            // Use the utility function for better error handling
            const subscription = await SubscriptionUtils.createOrActivateSubscription(validateData)
            
            return subscription
            
        } catch(error) {
            rethrowAppError(error, 'Failed to create new subscription')
        }
    }


    // get user subscription
    static async getUserSubscriptionService(userId:string){
        try {
            const subscription = await SubscriptionUtils.getActiveSubscriptions(userId)
            return subscription
        } catch (error) {
            rethrowAppError(error,'Failed to get user subscription')
        }
    }

    // remove subscription
    static async removeSubscriptionService(subscriptionId:string, studentId?: string){
        try {
            if (studentId) {
                // Use utility function for better validation
                const subscription = await SubscriptionUtils.deactivateSubscription(subscriptionId, studentId)
                return subscription
            } else {
                // Admin removal - direct deletion
                const subscription = await SubscriptionRepository.removeSubscription(subscriptionId)
                return subscription
            }
        } catch(error) {
            rethrowAppError(error, 'Failed to remove subscription')
        }
    }

}

