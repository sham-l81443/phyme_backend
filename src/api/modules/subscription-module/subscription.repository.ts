import prisma from "@/core/lib/prisma";
import { rethrowAppError } from "@/core/utils/errors/rethrowError";

export class SubscriptionRepository {
    
    static async createSubscription(data:any){
        try {
            
            const subscription = await prisma.studentSubscription.create({
                data
            })

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
}
