import prisma from "@/lib/prisma";
import { Response, Request, NextFunction } from "express";

const getQuiz = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const quizes = await prisma.quiz.findMany();
        res.status(200).json(quizes);
    } catch (error) {
        next(error);
    }


};

export default getQuiz