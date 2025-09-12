import prisma from "../../../core/lib/prisma";
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";

export class SubscriptionRepository {
    
    static async createSubscription(data:any){
        try {
            // Check if subscription already exists
            const existingSubscription = await prisma.studentSubscription.findUnique({
                where: {
                    studentId_termId: {
                        studentId: data.studentId,
                        termId: data.termId
                    }
                }
            });

            if (existingSubscription) {
                // If exists but inactive, activate it
                if (!existingSubscription.isActive) {
                    const updatedSubscription = await prisma.studentSubscription.update({
                        where: { id: existingSubscription.id },
                        data: { isActive: true }
                    });
                    return updatedSubscription;
                }
                // If already active, return existing
                return existingSubscription;
            }

            // Create new subscription with isActive: true
            const subscription = await prisma.studentSubscription.create({
                data: {
                    ...data,
                    isActive: true
                }
            });

            return subscription
            
        } catch (error) {
            rethrowAppError(error,'Failed to create new subscription')  
        }
    }

    static async getUserSubscription(userId:string){
        try {
            const subscription = await prisma.studentSubscription.findMany({
                where:{
                    studentId:userId
                }
            })
            return subscription
        } catch (error) {
            
            rethrowAppError(error,'Failed to get user subscription')
        }
    }

    // remove subscription
    static async removeSubscription(subscriptionId:string){
        try {
            const subscription = await prisma.studentSubscription.delete({where:{id:subscriptionId}})
            return subscription
        } catch (error) {
            rethrowAppError(error,'Failed to remove subscription')
        }
    }
}
