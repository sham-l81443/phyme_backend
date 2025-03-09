import { AppError } from "@/errors/AppError"
import prisma from "@/lib/prisma"
import { IController } from "@/types"
import createSuccessResponse from "@/utils/responseCreator"
import { createChapterSchema } from "@/validators/chapterSchema"

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