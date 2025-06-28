
import createSuccessResponse from "@/core/utils/responseCreator";
import { Request, Response, NextFunction } from "express";
import { videoRepository } from "@/api/repositories/video.repository";

const getLiveVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const allVideos = await videoRepository.getAllTutionVideos()


        const responseBody = createSuccessResponse({ data: allVideos, message: 'success' });


        res.status(200).json(responseBody);

    } catch (error) {

        next(error);

    }
};

export default getLiveVideos;