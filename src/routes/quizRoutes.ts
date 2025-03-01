import createQuestion from "@/controllers/quiz-controller/createQuestion";
import createQuizController from "@/controllers/quiz-controller/createQuiz";
import getQuestionsController from "@/controllers/quiz-controller/getQuestions";
import getQuizController from "@/controllers/quiz-controller/getQuiz";
import getQuizDetailsController from "@/controllers/quiz-controller/getQuizDetails";
import publishQuizController from "@/controllers/quiz-controller/publishQuiz";
import { Router } from "express";




const router = Router();


router.post('/create', createQuizController)
router.get('/list', getQuizController)
router.post('/questions', createQuestion)
router.get('/questions', getQuestionsController)
router.post('/publish', publishQuizController)
router.get('/details', getQuizDetailsController)

export default router