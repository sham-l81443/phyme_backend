import { AppError } from "../utils/errors/AppError";
import { IController } from "../types";
import prisma from "../lib/prisma";

export const isSubscribed: IController = async (req, _, next) => {
    try {
        if (!req?.user) {
            throw new AppError({ 
                errorType: "Unauthorized", 
                message: "User is not logged in" 
            });
        }

        const user: any = req?.user;
        const userId = user.id;

        // Check if user has any active subscriptions
        const activeSubscriptions = await prisma.studentSubscription.findMany({
            where: {
                studentId: userId,
                isActive: true
            },
            select: {
                id: true,
                termId: true,
                createdAt: true
            }
        });

        if (activeSubscriptions.length === 0) {
            throw new AppError({ 
                errorType: "Forbidden", 
                message: "Please subscribe to access this content. Contact your administrator to get access." 
            });
        }

        // Add subscription info to request for use in controllers
        req.userSubscriptions = activeSubscriptions;
        next();

    } catch (error) {
        next(error);
    }
};