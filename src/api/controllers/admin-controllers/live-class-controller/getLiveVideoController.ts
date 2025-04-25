import { AppError } from "@/utils/errors/AppError";
import prisma from "@/lib/prisma";
import createSuccessResponse from "@/utils/responseCreator";
import { Request, Response, NextFunction } from "express";

const getLiveVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // throw new AppError({ errorType: 'Internal Server Error', message: 'Internal server error' });


        const videos = await prisma.video.findMany({ where: { videoType: 'TUTION' } })


        const responseBody = createSuccessResponse({ data: videos, message: 'success', status: 'success' });



        res.status(200).json(responseBody);

    } catch (error) {

        next(error);

    }
};

export default getLiveVideos;