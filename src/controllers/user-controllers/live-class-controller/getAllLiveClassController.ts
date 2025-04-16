
import prisma from "@/lib/prisma";
import { IReqUser } from "@/types/req-user";
import createSuccessResponse from "@/utils/responseCreator";
import { Request, Response, NextFunction } from "express";

const getAllLiveClassUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user: IReqUser = req.user as IReqUser;

        const allVideos = await prisma.video.findMany({ where: { videoType: 'TUTION' }, orderBy: { createdAt: 'desc' }, omit: { embedLink: true } });


        if (!allVideos) {
            return res.status(404).json(createSuccessResponse({ data: [], message: 'success', status: 'success' }));
        }



        const responseBody = createSuccessResponse({ data: allVideos, message: 'success', status: 'success', meta: { isLocked: user.role === "FREE" ? true : false } });

        res.status(200).json(responseBody);

    } catch (error) {

        next(error);

    }
};

export default getAllLiveClassUserController;