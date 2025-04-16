
import { AppError } from "@/errors/AppError";
import prisma from "@/lib/prisma";
import { IReqUser } from "@/types/req-user";
import customEncoder from "@/utils/customEncoder";
import createSuccessResponse from "@/utils/responseCreator";
import { Request, Response, NextFunction } from "express";

const getLiveClassByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = req.user as IReqUser

        const video = await prisma.video.findUnique({ where: { id: req.params.videoId }, });

        if (!video) {
            throw new AppError({ message: 'Video not found', errorType: 'Not Found' });
        }

        if (video?.isFree === false && user.role === 'FREE') {
            throw new AppError({ message: 'This video is only available for premium users', errorType: 'Forbidden' });
        }

        video.embedLink = video.embedLink.split('').reverse().join('')
        const responseBody = createSuccessResponse({ data: video, message: 'success', status: 'success' });

        res.status(200).json(responseBody);

    } catch (error) {

        next(error);

    }
};

export default getLiveClassByIdController;