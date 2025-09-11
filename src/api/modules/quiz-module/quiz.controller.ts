import { Request, Response, NextFunction } from 'express';
import { QuizService } from './quiz.service';
import createSuccessResponse from '../../../core/utils/responseCreator';
import { AppError } from '../../../core/utils/errors/AppError';
import { 
  CreateQuizRequest, 
  UpdateQuizRequest, 
  QuizSearchParams,
  QuestionSearchParams,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  AssignQuestionToQuizRequest,
  BulkAssignQuestionsRequest,
  StartQuizAttemptRequest,
  SubmitQuizAnswerRequest,
  SubmitQuizAttemptRequest
} from './quiz.types';

export class QuizController {
  // Quiz Management (Admin)
  static async createQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateQuizRequest = req.body;
      const createdBy = req.user?.userId;

      if (!createdBy) {
        throw new AppError({
          errorType: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      const quiz = await QuizService.createQuiz(data, createdBy);

      res.status(201).json(
        createSuccessResponse({
          data: quiz,
          message: 'Quiz created successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getQuizById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const quiz = await QuizService.getQuizById(id);

      res.status(200).json(
        createSuccessResponse({
          data: quiz,
          message: 'Quiz retrieved successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getQuizzesByLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;
      const quizzes = await QuizService.getQuizzesByLesson(lessonId);

      res.status(200).json(
        createSuccessResponse({
          data: quizzes,
          message: 'Quizzes retrieved successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async searchQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const params: QuizSearchParams = {
        lessonId: req.query.lessonId as string,
        difficulty: req.query.difficulty as any,
        paceType: req.query.paceType as any,
        isTimed: req.query.isTimed === 'true' ? true : req.query.isTimed === 'false' ? false : undefined,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any
      };

      const result = await QuizService.searchQuizzes(params);

      res.status(200).json(
        createSuccessResponse({
          data: result,
          message: 'Quizzes retrieved successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getStudentQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const params: QuizSearchParams = {
        lessonId: req.query.lessonId as string,
        difficulty: req.query.difficulty as any,
        paceType: req.query.paceType as any,
        isTimed: req.query.isTimed === 'true' ? true : req.query.isTimed === 'false' ? false : undefined,
        isActive: true, // Only show active quizzes to students
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any
      };

      const result = await QuizService.searchQuizzes(params);

      res.status(200).json(
        createSuccessResponse({
          data: result,
          message: 'Student quizzes retrieved successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateQuizRequest = { ...req.body, id };
      const quiz = await QuizService.updateQuiz(id, data);

      res.status(200).json(
        createSuccessResponse({
          data: quiz,
          message: 'Quiz updated successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await QuizService.deleteQuiz(id);

      res.status(200).json(
        createSuccessResponse({
          data: result,
          message: 'Quiz deleted successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Question Management (Admin)
  static async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateQuestionRequest = req.body;
      const createdBy = req.user?.userId;

      if (!createdBy) {
        throw new AppError({
          errorType: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      const question = await QuizService.createQuestion(data, createdBy);

      res.status(201).json(
        createSuccessResponse({
          data: question,
          message: 'Question created successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getQuestionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const question = await QuizService.getQuestionById(id);

      res.status(200).json(
        createSuccessResponse({
          data: question,
          message: 'Question retrieved successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async searchQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const params: QuestionSearchParams = {
        type: req.query.type as any,
        difficulty: req.query.difficulty as any,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any
      };

      const result = await QuizService.searchQuestions(params);

      res.status(200).json(
        createSuccessResponse({
          data: result,
          message: 'Questions retrieved successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateQuestionRequest = { ...req.body, id };
      const question = await QuizService.updateQuestion(id, data);

      res.status(200).json(
        createSuccessResponse({
          data: question,
          message: 'Question updated successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await QuizService.deleteQuestion(id);

      res.status(200).json(
        createSuccessResponse({
          data: result,
          message: 'Question deleted successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Quiz Question Assignment (Admin)
  static async assignQuestionToQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const data: AssignQuestionToQuizRequest = req.body;
      const question = await QuizService.assignQuestionToQuiz(data);

      res.status(200).json(
        createSuccessResponse({
          data: question,
          message: 'Question assigned to quiz successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async bulkAssignQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const data: BulkAssignQuestionsRequest = req.body;
      const result = await QuizService.bulkAssignQuestions(data);

      res.status(200).json(
        createSuccessResponse({
          data: result,
          message: 'Questions assigned to quiz successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async removeQuestionFromQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId, questionId } = req.params;
      const result = await QuizService.removeQuestionFromQuiz(quizId, questionId);

      res.status(200).json(
        createSuccessResponse({
          data: result,
          message: 'Question removed from quiz successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Quiz Taking (Student)
  static async startQuizAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const data: StartQuizAttemptRequest = req.body;
      const studentId = req.user?.userId;

      if (!studentId) {
        throw new AppError({
          errorType: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      const session = await QuizService.startQuizAttempt(data, studentId);

      res.status(200).json(
        createSuccessResponse({
          data: session,
          message: 'Quiz attempt started successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async submitQuizAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const data: SubmitQuizAnswerRequest = req.body;
      const answer = await QuizService.submitQuizAnswer(data);

      res.status(200).json(
        createSuccessResponse({
          data: answer,
          message: 'Answer submitted successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async submitQuizAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const data: SubmitQuizAttemptRequest = req.body;
      const attempt = await QuizService.submitQuizAttempt(data);

      res.status(200).json(
        createSuccessResponse({
          data: attempt,
          message: 'Quiz attempt submitted successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Performance and Analytics
  static async getQuizPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;
      const studentId = req.user?.userId;

      if (!studentId) {
        throw new AppError({
          errorType: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      const performance = await QuizService.getQuizPerformance(quizId, studentId);

      res.status(200).json(
        createSuccessResponse({
          data: performance,
          message: 'Quiz performance retrieved successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getQuizLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await QuizService.getQuizLeaderboard(quizId, limit);

      res.status(200).json(
        createSuccessResponse({
          data: leaderboard,
          message: 'Quiz leaderboard retrieved successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getQuizStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await QuizService.getQuizStats();

      res.status(200).json(
        createSuccessResponse({
          data: stats,
          message: 'Quiz statistics retrieved successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }

  // Get all quiz attempts for a student
  static async getStudentQuizAttempts(req: Request, res: Response, next: NextFunction) {
    try {
      const { quizId } = req.params;
      const studentId = req.user?.userId;

      if (!studentId) {
        throw new AppError({
          errorType: 'Unauthorized',
          message: 'User not authenticated'
        });
      }

      // This would need to be implemented in the service
      // For now, returning a placeholder
      res.status(200).json(
        createSuccessResponse({
          data: [],
          message: 'Student quiz attempts retrieved successfully'
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
