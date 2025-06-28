import prisma from "@/core/lib/prisma";
import { IController } from "@/core/types";
import { AppError } from "@/core/utils/errors/AppError";
import createSuccessResponse from "@/core/utils/responseCreator";

const getClassController: IController = async (req, res, next) => {

    try {

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