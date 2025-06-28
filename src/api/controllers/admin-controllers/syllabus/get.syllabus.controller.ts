import prisma from "@/core/lib/prisma";
import { IController } from "@/core/types";
import { AppError } from "@/core/utils/errors/AppError";
import createSuccessResponse from "@/core/utils/responseCreator";

const getSyllabusController: IController = async (req, res, next) => {

  try {


    // if (!req.user) {
    //   throw new AppError({

    //     errorType: 'Unauthorized',
    //     message: 'User not authenticated',
    //   });
    // }

    const syllabusList = await prisma.syllabus.findMany()

    const successObj = createSuccessResponse({
      data: syllabusList,
    });

    res.status(200).json(successObj);
  } catch (e) {
    console.error("Error in get.syllabus.controller.ts:", e);
    next(e);
  }
};

export default getSyllabusController;