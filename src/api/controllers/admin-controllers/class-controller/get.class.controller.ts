import prisma from "@/lib/prisma";
import { IController } from "@/types";
import { AppError } from "@/utils/errors/AppError";
import createSuccessResponse from "@/utils/responseCreator";

const getClassController: IController = async (req, res, next) => {

    try {

        // if (!req.user) {
        //     throw new AppError({

        //         errorType: 'Unauthorized',
        //         message: 'User not authenticated',
        //     });
        // }

        const classList = await prisma.class.findMany()

        const successObj = createSuccessResponse({
            data: classList,
        });

        res.status(200).json(successObj);
    } catch (e) {
        console.error("Error in get.syllabus.controller.ts:", e);
        next(e);
    }
};

export default getClassController;