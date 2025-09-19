import { Router } from 'express';
import { QuizController } from './quiz.controller';
import { authenticateAdmin } from '../../../core/middleware/auth/authenticateAdmin';
import { authenticateStudent } from '../../../core/middleware/auth/authenticateStudent';
import { allColors } from 'winston/lib/winston/config';
import { createQuizController, createQuestionController } from './controller';
// Validation is handled in the service layer

const router = Router();

// Quiz Management Routes (Admin Only)
router.post('/quiz/create', authenticateAdmin, createQuizController);

// router.get('/quiz/all', authenticateAdmin, QuizController.getAllQuizzes);

router.get('/quiz/getQuizById/:id', authenticateAdmin, QuizController.getQuizById);

router.get('/quiz/getQuizzesByLesson/:lessonId', authenticateAdmin, QuizController.getQuizzesByLesson);

router.get('/quiz/all', authenticateAdmin, QuizController.searchQuizzes);

// Student Quiz Listing Routes
router.get('/quizzes/student', authenticateStudent, QuizController.getStudentQuizzes);
router.get('/quiz/lesson/:lessonId', authenticateStudent, QuizController.getQuizzesByLesson);

router.put('/quizzes/:id', authenticateAdmin, QuizController.updateQuiz);
router.delete('/quizzes/:id', authenticateAdmin, QuizController.deleteQuiz);

// Question Management Routes (Admin Only)
router.post('/question/create', authenticateAdmin, createQuestionController);
router.get('/questions/:id', authenticateAdmin, QuizController.getQuestionById);
router.get('/question/all', authenticateAdmin, QuizController.searchQuestions);
router.put('/questions/:id', authenticateAdmin, QuizController.updateQuestion);
router.delete('/question/:id', authenticateAdmin, QuizController.deleteQuestion);

// Quiz Question Assignment Routes (Admin Only)
router.post('/quizzes/questions/assign', authenticateAdmin, QuizController.assignQuestionToQuiz);
router.post('/quizzes/questions/bulk-assign', authenticateAdmin, QuizController.bulkAssignQuestions);
router.delete('/quizzes/:quizId/questions/:questionId', authenticateAdmin, QuizController.removeQuestionFromQuiz);

// Quiz Taking Routes (Student Only)
router.post('/quizzes/start', authenticateStudent, QuizController.startQuizAttempt);
router.post('/quizzes/answers/submit', authenticateStudent, QuizController.submitQuizAnswer);
router.post('/quizzes/submit', authenticateStudent, QuizController.submitQuizAttempt);

// Performance and Analytics Routes
router.get('/quizzes/:quizId/performance', authenticateStudent, QuizController.getQuizPerformance);
router.get('/quizzes/:quizId/leaderboard', QuizController.getQuizLeaderboard);
router.get('/quizzes/stats', authenticateAdmin, QuizController.getQuizStats);
router.get('/quizzes/:quizId/attempts', authenticateStudent, QuizController.getStudentQuizAttempts);

export default router;
