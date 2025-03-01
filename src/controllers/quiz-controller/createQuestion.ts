import prisma from "@/lib/prisma"
import { PrismaClient } from "@prisma/client"
import { NextFunction, Request, Response } from "express"


interface IOption {
    value: string,
    isAnswer: boolean
}


interface IOptionWithID {
    option: string,
    isCorrect: boolean,
    id: string
}

const createQuestion = async (req: Request, res: Response, next: NextFunction) => {


    try {


        const trsnx = await prisma.$transaction(async (tx) => {
            const results = [];

            for (const element of req.body.questions) {

                const optionsWithId = element.options.map((option: IOption) => ({
                    option: option.value,
                    isCorrect: option.isAnswer,
                    id: crypto.randomUUID(),
                    
                }));

                const correctOption = optionsWithId.find((option: IOptionWithID) => option.isCorrect);

                const createdQuestion = await tx.question.create({
                    data: {
                        question: element.question,
                        correctOptionId: correctOption.id,
                        options: {
                            create: optionsWithId,
                        },
                        quiz: {
                            connect: {
                                id: req.body.quizId,
                            },
                        },

                    },
                    include: {
                        options: true
                    }
                });

                results.push(createdQuestion);
            }

            return results; // Return all created questions
        });

        res.status(201).json(trsnx);



    } catch (error) {

        next(error)
    }



}

export default createQuestion