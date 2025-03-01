import { AppError } from "@/errors/AppError"
import createErrorObject from "@/errors/createError"
import prisma from "@/lib/prisma"
import logger from "@/utils/logger"
import { publishQuizSchema } from "@/validators/quizSchema"
import { Request, Response, NextFunction } from "express"

import { randomBytes } from "crypto"



const publishQuizController = async (req: Request, res: Response, next: NextFunction) => {


    try {
        logger.log('hello')

        const validatedData = publishQuizSchema.parse(req.body)

        const { quizId } = validatedData



        const isQuizPresent = await prisma.quiz.findUnique({
            where: { id: quizId },
            select: {
                isPublished: true
            }
        })

        if (!isQuizPresent) {

            const error = createErrorObject({ errorType: "Not Found", data: null, message: 'Quiz with id not found' })
            throw new AppError(error)

        }


        if (isQuizPresent.isPublished) {

            const publishData = await prisma.quiz.update({
                where: { id: quizId },
                data: {
                    accessCode: null,
                    isPublished: false
                }

            })

            res.status(200).json({
                message: "Quiz unpublished sucessfully",
                data: publishData
            })
            return
        }


        const accessCode = randomBytes(4).toString('hex').toUpperCase();


        const publishData = await prisma.quiz.update({
            where: { id: quizId },
            data: {
                accessCode: accessCode,
                isPublished: true
            }

        })


        res.status(200).json({
            message: "Quiz published sucessfully",
            data: publishData
        })
        return

    } catch (error) {

        next(error)

    }


}

export default publishQuizController;