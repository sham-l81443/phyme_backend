import { AppError } from "@/utils/errors/AppError"
import prisma from "@/lib/prisma"
import { IController } from "@/types"
import createSuccessResponse from "@/utils/responseCreator"
import { deleteChapterSchema } from "@/schema/chapterSchema"

const deleteChapterController: IController = async (req: any, res, next) => {

    try {



        if (!req.user) {

            throw new AppError({ errorType: 'Unauthorized', message: 'User not found' })

        }

        const adminId = req.user.userId

        if (!adminId) {

            throw new AppError({ errorType: 'Unauthorized', message: 'User not found' })

        }

        const validatedData = deleteChapterSchema.parse(req.body)

        const chapter = await prisma.chapter.delete({
            where: {
                id: validatedData.id
            },
            select: {
                class: true,
                description: true,
                title: true,
                createdAt: true,
                id: true,
                updatedAt: true,

            }
        })

        const resObj = createSuccessResponse({
            message: "Chapter deleted successfully",
            data: chapter
        })

        res.status(200).json(resObj)
        return

    } catch (e) {

        next(e)
    }

}

export default deleteChapterController;