import prisma from "@/core/lib/prisma";
import { CreateVideoDto } from '@/core/schema/video.schema'
import { AppError } from "@/core/utils/errors/AppError";
import { handleRepositoryError } from "@/core/utils/errors/handleRepositoryError";

export class videoRepository {

    static async getVideoByUniqueCode(code: string) {
        try {
            const uniqueVideo = await prisma.video.findUnique({
                where: { code: code }
            })

            if (!uniqueVideo) {
                throw new AppError({ message: "Video not found", errorType: "Not Found" })
            }
            return uniqueVideo

        } catch (e) {
            handleRepositoryError(e)
        }

    }



    static async createVideo(data: CreateVideoDto) {
        try {
            const newVideo = await prisma.video.create({
                data: data,
            })
            return newVideo

        } catch (e) {
            handleRepositoryError(e)
        }

    }

    static async getAllTutionVideos() {
        try {

            const allVideos = await prisma.video.findMany({
                where: { videoType: 'TUTION' }
            })

            return allVideos;

        } catch (e) {
            handleRepositoryError(e)
        }
    }

    static async deleteVideo(id: string) {
        try {
            const deletedVideo = await prisma.video.delete({
                where: { id: id }
            })
            return deletedVideo

        } catch (e) {
            handleRepositoryError(e)
        }
    }
}