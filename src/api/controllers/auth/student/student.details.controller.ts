import prisma from "@/core/lib/prisma";
import { IStudentAccessToken } from "@/core/schema";
import { IController } from "@/core/types";
import { AppError } from "@/core/utils/errors/AppError";
import createSuccessResponse from "@/core/utils/responseCreator";

const studentDetailsController: IController= async (req, res, next) => {

  try {

    if(!req.user) {
      throw new AppError({
        errorType: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const user = req.user as IStudentAccessToken;

    const userData = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userData) {
      throw new AppError({
        errorType: 'Not Found',
        message: 'User not found',
      });
    }

    const successObj = createSuccessResponse({
      data: userData,
      code: 200,
      message: "User details retrieved successfully"
    });

    res.status(200).json(successObj);
  } catch (e) {
    console.error("Error in student.details.controller.ts:", e);
    next(e);
  }
};

export default studentDetailsController