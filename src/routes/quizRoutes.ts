import createQuiz from "@/controllers/quiz-controller/createQuiz";
import getQuiz from "@/controllers/quiz-controller/getQuiz";
import { Router } from "express";




const router = Router();


router.post('/create', createQuiz)
router.get('/list', getQuiz)

export default router