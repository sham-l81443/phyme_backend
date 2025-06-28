import { AppError } from "@/core/utils/errors/AppError";
import { IController } from "@/core/types";

export const isSubscribed: IController = (req, _, next) => {

    try {

        if (!req?.user) {
            throw new AppError({ errorType: "Unauthorized", message: "User is not logged in" })
        }

        const user: any = req?.user;


        if (user?.role !== 'PAID') {
            throw new AppError({ errorType: "Forbidden", message: "Please subscribe to use this feature" });
        }

        next();

    } catch (error) {

        next(error);

    }

};