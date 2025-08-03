import { rethrowAppError } from "../../../core/utils/errors/rethrowError";

import { VideoValidation } from "./video.validation";
import { validateDto } from "../../../core/utils";
import { VideoRepository } from "./video.repository";
import { AppError } from "../../../core/utils/errors/AppError";

export class VideoService {


    static async createVideoService(data: any) {

        try {

            const validatedData = validateDto(VideoValidation.createVideo, data)

            const video = await VideoRepository.createVideo({
                name: validatedData.name,
                description: validatedData.description,
                embedLink: validatedData.embedLink,
                duration: validatedData.duration,
                code: validatedData.code,
                thumbnail: validatedData.thumbnail,
                lessonId: validatedData.lessonId,
            })

            return video

        } catch (error) {

            rethrowAppError(error, 'Failed to create new folder')

        }

    }

    static async getAllVideos() {

        try {

            const videos = await VideoRepository.getAllVideos()

            return videos

        } catch (error) {

            rethrowAppError(error, 'Failed to fetch videos')

        }

    }


    static async getAllVideosByLessonId(lessonId: string) {

        try {

            const videos = await VideoRepository.getAllVideosByLessonId(lessonId)

            return videos

        } catch (error) {

            rethrowAppError(error, 'Failed to fetch videos')

        }

    }

    static async getVideoById(id: string) {

        try {

            const video = await VideoRepository.getVideoById(id)

            return video

        } catch (error) {

            rethrowAppError(error, 'Failed to fetch video')

        }

    }
}

