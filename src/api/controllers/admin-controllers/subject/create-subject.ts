import prisma from "@/core/lib/prisma"
import { SubjectSchema } from "@/core/schema/subjectSchema"
import { IController } from "@/core/types"
import { AppError } from "@/core/utils/errors/AppError"
import createSuccessResponse from "@/core/utils/responseCreator"

const createSubjectController: IController = async (req: any, res, next) => {

    try {

        // if (!req.user) {

        //     throw new AppError({ errorType: 'Unauthorized', message: 'User not found' })

        // }

        // const adminId = req.user.userId

        // if (!adminId) {

        //     throw new AppError({ errorType: 'Unauthorized', message: 'User not found' })

        // }

        const validatedData = await SubjectSchema.create.safeParseAsync(req.body)

        if(!validatedData.success){

            throw new AppError({ errorType: 'Bad Request', message: validatedData.error.message })

        }

        const subject = await prisma.subject.create({
            data: {
                name: validatedData?.data?.name,
                classId: parseInt(validatedData?.data?.classId),
                teacherName: validatedData?.data?.teacherName,
                code: validatedData?.data?.code
            },
            select: {
                name: true,
                createdAt: true,
                id: true,
                updatedAt: true,
                code: true,
                teacherName: true

            }
        })

        const resObj = createSuccessResponse({
            message: "Subject created successfully",
            data: subject
        })

        res.status(201).json(resObj)
        return

    } catch (e) {

        next(e)
    }

}
export default createSubjectController