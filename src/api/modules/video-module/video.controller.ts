import { Request, Response, NextFunction } from "express";
import { VideoService } from "./video.service";
import createSuccessResponse from "../../../core/utils/responseCreator";
import { AppError } from "../../../core/utils/errors/AppError";

export class VideoController {

    static async createVideo(req: Request, res: Response, next: NextFunction) {

        try {

            const video = await VideoService.createVideoService(req.body)

            const response = createSuccessResponse({ data: video, message: "Video created successfully" })

            res.status(201).json(response)
        } catch (error) {
            next(error)
        }

    }

    static async getAllVideos(req: Request, res: Response, next: NextFunction) {

        try {

            const videos = await VideoService.getAllVideos()

            const response = createSuccessResponse({ data: videos, message: "Videos fetched successfully" })

            res.status(200).json(response)

        } catch (error) {

            next(error)

        }

    }

    static async getAllVideosByLessonId(req: Request, res: Response, next: NextFunction) {

        try {

            console.log(req.query)


            const videos = await VideoService.getAllVideosByLessonId(req.query?.lessonId as string)

            const response = createSuccessResponse({ data: videos, message: "Videos fetched successfully" })

            res.status(200).json(response)
        } catch (error) {
            next(error)
        }

    }


    static async getVideoById(req: Request, res: Response, next: NextFunction) {

        try {

            const video = await VideoService.getVideoById(req.query?.videoId as string)


            if (!video) {
                throw new AppError({ message: "Video not found", errorType: "Not Found" })
            }

            video.embedLink = video.embedLink.split('').reverse().join('')

            const response = createSuccessResponse({ data: video, message: "Video fetched successfully" })

            res.status(200).json(response)
        } catch (error) {
            next(error)
        }

    }

    static async updateVideoController(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updatedVideo = await VideoService.updateVideoService(id, req.body);

            const responseData = createSuccessResponse({ 
                data: updatedVideo, 
                message: 'Video updated successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }

    static async deleteVideoController(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await VideoService.deleteVideoService(id);

            const responseData = createSuccessResponse({ 
                data: null, 
                message: 'Video deleted successfully' 
            });

            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }
    }

}