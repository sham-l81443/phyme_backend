import prisma from "@/lib/prisma"
import CreateResponse from "@/utils/responseCreator"
import { Request, Response, NextFunction } from "express"


const getQuizDetails = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const quizId = req.query.quizId as string

        const quizDetails = await prisma.quiz.findUnique({
            where: { id: quizId }
        })


        const response = CreateResponse.success({ data: quizDetails })

        res.status(200).json({
            data: quizDetails,

        })

        return


    } catch (error) {
        next(error)
    }




}

export default getQuizDetails;