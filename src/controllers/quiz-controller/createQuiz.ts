import prisma from "@/lib/prisma"
import { createQuizSchema } from "@/validators/quizSchema"
import { Request, Response } from "express"


const createQuiz = async (req: Request, res: Response) => {


    try {


        // validate user

        // validate request body


        const validatedData = createQuizSchema.parse(req.body)

        // create quiz

        const newQuiz = await prisma.quiz.create({
            data: {
                title: validatedData.title,
                description: validatedData.description
            }
        })

        // return response

        res.status(201).json(newQuiz)
        return

    } catch (error) {

        console.log(error)
    }
}

export default createQuiz