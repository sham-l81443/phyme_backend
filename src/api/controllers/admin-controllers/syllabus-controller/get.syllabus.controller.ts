import prisma from "@/lib/prisma";
import { IController } from "@/types";
import { AppError } from "@/utils/errors/AppError";
import createSuccessResponse from "@/utils/responseCreator";

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