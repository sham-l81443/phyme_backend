import { AppError } from "@/core/utils/errors/AppError"
import prisma from "@/core/lib/prisma"
import { IController } from "@/core/types"
import createSuccessResponse from "@/core/utils/responseCreator"
import { createChapterSchema } from "@/core/schema/chapterSchema"

const createChapterController: IController = async (req: any, res, next) => {

    try {


        if (!req.user) {

            throw new AppError({ errorType: 'Unauthorized', message: 'User not found' })

        }

        const adminId = req.user.userId

        if (!adminId) {

            throw new AppError({ errorType: 'Unauthorized', message: 'User not found' })

        }

        const validatedData = createChapterSchema.parse(req.body)

        const chapter = await prisma.chapter.create({
            data: {
                title: validatedData?.title,
                adminId: adminId,
                class: validatedData?.class,
                description: validatedData?.description
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
            message: "Chapter created successfully",
            data: chapter
        })

        res.status(201).json(resObj)
        return

    } catch (e) {

        next(e)
    }

}

export default createChapterController;