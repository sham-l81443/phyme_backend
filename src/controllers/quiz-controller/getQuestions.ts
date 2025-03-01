import prisma from "@/lib/prisma";
import { Request, Response, NextFunction } from "express"

const getQuestionsController = async (req: Request, res: Response, next: NextFunction) => {
    console.log('api hit')

    try {

        const quizId = req.query.quizId as string;

        console.log(quizId)

        const questions = await prisma.question.findMany({
            where: {
                quizId: quizId,
            },
            include: {
                options: true,
            },
        });

        console.log(questions)

        res.status(200).json(questions);

    } catch (error) {
        console.log(error)
        next(error);
    }



}

export default getQuestionsController