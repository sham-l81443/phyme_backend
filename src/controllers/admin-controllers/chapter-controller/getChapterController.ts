import { AppError } from "@/errors/AppError"
import prisma from "@/lib/prisma"
import { IController } from "@/types"
import createSuccessResponse from "@/utils/responseCreator"
import { createChapterSchema } from "@/validators/chapterSchema"

const getChaptersController: IController = async (req: any, res, next) => {

    try {


        if (!req.user) {

            throw new AppError({ errorType: 'Unauthorized', message: 'User not found' })

        }

        const adminId = req.user.userId

        if (!adminId) {

            throw new AppError({ errorType: 'Unauthorized', message: 'User not found' })

        }

        const admin = await prisma.admin.findFirst({
            where: {
                id: adminId
            },
            include: {
                chapters: true
            }
        })

        if (!admin) {

            throw new AppError({ errorType: 'Unauthorized', message: 'Admin not found' })
        }


        const resObj = createSuccessResponse({
            message: "Chapters fetched successfully",
            data: admin.chapters
        })

        res.status(200).json(resObj)
        return

    } catch (e) {

        next(e)
    }

}

export default getChaptersController;