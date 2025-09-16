import { QuizRepository } from './quiz.repository';
import { LessonRepository } from '../lesson-module/lesson.repository';
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
  SubmitQuizAttemptRequest,
  QuizResponse,
  QuestionResponse,
  QuizAttemptResponse,
  QuizPerformanceResponse,
  QuizLeaderboardResponse,
  QuizAnalyticsResponse,
  QuizSessionResponse,
  QuizStatsResponse
} from './quiz.types';
import { AppError } from '../../../core/utils/errors/AppError';
import { rethrowAppError } from '../../../core/utils/errors/rethrowError';
import { QuestionType, AttemptStatus } from '@prisma/client';
import prisma from '../../../core/lib/prisma';

export class QuizService {
  // Quiz Management
  static async createQuiz(data: CreateQuizRequest, createdBy: string) {
    try {
      // Validate content association (only one should be set)
      const associations = [data.subjectId, data.chapterId, data.lessonId, data.termId].filter(Boolean);
      if (associations.length > 1) {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'Quiz can only be associated with one content type (subject, chapter, lesson, or term)'
        });
      }

      // Validate time settings
      if (data.isTimed && (!data.timeLimit || data.timeLimit <= 0)) {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'Time limit must be specified for timed quizzes'
        });
      }

      // Validate date range
      if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'Start date must be before end date'
        });
      }

      // Validate term exists if specified
      if (data.termId) {
        const term = await prisma.term.findUnique({ where: { id: data.termId } });
        if (!term) {
          throw new AppError({
            errorType: 'Not Found',
            message: 'Term not found'
          });
        }
      }

      // Validate subject exists if specified
      if (data.subjectId) {
        const subject = await prisma.subject.findUnique({ where: { id: data.subjectId } });
        if (!subject) {
          throw new AppError({
            errorType: 'Not Found',
            message: 'Subject not found'
          });
        }
      }

      // Validate chapter exists if specified
      if (data.chapterId) {
        const chapter = await prisma.chapter.findUnique({ where: { id: data.chapterId } });
        if (!chapter) {
          throw new AppError({
            errorType: 'Not Found',
            message: 'Chapter not found'
          });
        }
      }

      // Validate lesson exists if specified
      if (data.lessonId) {
        const lesson = await prisma.lesson.findUnique({ where: { id: data.lessonId } });
        if (!lesson) {
          throw new AppError({
            errorType: 'Not Found',
            message: 'Lesson not found'
          });
        }
      }

      const quiz = await QuizRepository.createQuiz({ ...data, createdBy });
      return this.formatQuizResponse(quiz);
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async getAllQuizzes() {
    try {
      const quizzes = await QuizRepository.getAllQuizzes();
      return quizzes
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async getQuizById(id: string) {
    try {
      const quiz = await QuizRepository.getQuizById(id);
      if (!quiz) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Quiz not found'
        });
      }
      return this.formatQuizResponse(quiz);
    } catch (error) {
      rethrowAppError(error, 'Failed to get quiz');
    }
  }

  static async getQuizzesByLesson(lessonId: string) {
    try {
      const quizzes = await QuizRepository.getQuizzesByLesson(lessonId);
      return quizzes.map(quiz => this.formatQuizResponse(quiz));
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async searchQuizzes(params: QuizSearchParams) {
    try {
      const result = await QuizRepository.searchQuizzes(params);
      return {
        ...result,
        quizzes: result.quizzes.map(quiz => this.formatQuizResponse(quiz))
      };
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async updateQuiz(id: string, data: UpdateQuizRequest) {
    try {
      const existingQuiz = await QuizRepository.getQuizById(id);
      if (!existingQuiz) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Quiz not found'
        });
      }

      // Validate time settings
      if (data.isTimed && (!data.timeLimit || data.timeLimit <= 0)) {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'Time limit must be specified for timed quizzes'
        });
      }

      const quiz = await QuizRepository.updateQuiz(id, data);
      return this.formatQuizResponse(quiz);
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async deleteQuiz(id: string) {
    try {
      const existingQuiz = await QuizRepository.getQuizById(id);
      if (!existingQuiz) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Quiz not found'
        });
      }

      await QuizRepository.deleteQuiz(id);
      return { message: 'Quiz deleted successfully' };
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  // Question Management
  static async createQuestion(data: CreateQuestionRequest, createdBy: string) {
    try {
      // Validate question type and answers
      this.validateQuestionData(data);

      const question = await QuizRepository.createQuestion({ ...data, createdBy });
      return this.formatQuestionResponse(question);
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async getQuestionById(id: string) {
    try {
      const question = await QuizRepository.getQuestionById(id);
      if (!question) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Question not found'
        });
      }
      return this.formatQuestionResponse(question);
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async searchQuestions(params: QuestionSearchParams) {
    try {
      const result = await QuizRepository.searchQuestions(params);
      return {
        ...result,
        questions: result.questions.map(question => this.formatQuestionResponse(question))
      };
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async updateQuestion(id: string, data: UpdateQuestionRequest) {
    try {
      const existingQuestion = await QuizRepository.getQuestionById(id);
      if (!existingQuestion) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Question not found'
        });
      }

      if (data.answers) {
        this.validateQuestionData({ ...data, type: data.type || existingQuestion.type });
      }

      const question = await QuizRepository.updateQuestion(id, data);
      return this.formatQuestionResponse(question);
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async deleteQuestion(id: string) {
    try {
      const existingQuestion = await QuizRepository.getQuestionById(id);
      if (!existingQuestion) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Question not found'
        });
      }

      await QuizRepository.deleteQuestion(id);
      return { message: 'Question deleted successfully' };
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  // Quiz Question Assignment
  static async assignQuestionToQuiz(data: AssignQuestionToQuizRequest) {
    try {
      const assignment = await QuizRepository.assignQuestionToQuiz(data);
      return this.formatQuestionResponse(assignment.question);
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async bulkAssignQuestions(data: BulkAssignQuestionsRequest) {
    try {
      const result = await QuizRepository.bulkAssignQuestions(data);
      return { 
        message: `${result.count} questions assigned successfully`,
        count: result.count
      };
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async removeQuestionFromQuiz(quizId: string, questionId: string) {
    try {
      await QuizRepository.removeQuestionFromQuiz(quizId, questionId);
      return { message: 'Question removed from quiz successfully' };
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  // Quiz Taking
  static async startQuizAttempt(data: StartQuizAttemptRequest, studentId: string) {
    try {
      const quiz = await QuizRepository.getQuizById(data.quizId);
      if (!quiz) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Quiz not found'
        });
      }

      if (!quiz.isActive) {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'Quiz is not active'
        });
      }

      // Check if quiz is within time window
      const now = new Date();
      if (quiz.startDate && now < quiz.startDate) {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'Quiz has not started yet'
        });
      }

      if (quiz.endDate && now > quiz.endDate) {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'Quiz has ended'
        });
      }

      // Check existing attempts
      const existingAttempts = await QuizRepository.getStudentQuizAttempts(data.quizId, studentId);
      const attemptNumber = existingAttempts.length + 1;

      if (attemptNumber > quiz.maxAttempts) {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'Maximum attempts exceeded'
        });
      }

      // Create new attempt
      const attempt = await QuizRepository.createQuizAttempt(data.quizId, studentId, attemptNumber);
      
      // Get quiz questions for the session
      const questions = quiz.questions.map(qq => this.formatQuestionResponse(qq.question, qq.position, qq.points || undefined));
      
      return {
        attemptId: attempt.id,
        quiz: this.formatQuizResponse(quiz),
        questions,
        timeRemaining: quiz.isTimed ? quiz.timeLimit! * 60 : undefined,
        currentQuestionIndex: 0,
        totalQuestions: questions.length
      } as QuizSessionResponse;
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async submitQuizAnswer(data: SubmitQuizAnswerRequest) {
    try {
      const attempt = await QuizRepository.getQuizAttempt(data.attemptId);
      if (!attempt) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Quiz attempt not found'
        });
      }

      if (attempt.status !== 'IN_PROGRESS') {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'Quiz attempt is not in progress'
        });
      }

      // Find the question in the quiz
      const quizQuestion = attempt.quiz.questions.find(qq => qq.questionId === data.questionId);
      if (!quizQuestion) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Question not found in this quiz'
        });
      }

      // Calculate score
      let isCorrect = false;
      let pointsEarned = 0;

      if (data.answerId) {
        // Multiple choice answer
        const selectedAnswer = quizQuestion.question.answers.find(a => a.id === data.answerId);
        isCorrect = selectedAnswer?.isCorrect || false;
      } else if (data.textAnswer) {
        // Text-based answer - basic validation (can be enhanced)
        const correctAnswer = quizQuestion.question.answers.find(a => a.isCorrect);
        isCorrect = correctAnswer?.content.toLowerCase().trim() === data.textAnswer.toLowerCase().trim();
      }

      if (isCorrect) {
        pointsEarned = quizQuestion.points || quizQuestion.question.points;
      } else if (attempt.quiz.hasNegativeMarking && attempt.quiz.negativeMarkRatio) {
        pointsEarned = -(quizQuestion.points || quizQuestion.question.points) * attempt.quiz.negativeMarkRatio;
      }

      // Create or update answer
      const answer = await prisma.quizAnswer.upsert({
        where: {
          attemptId_questionId: {
            attemptId: data.attemptId,
            questionId: data.questionId
          }
        },
        update: {
          answerId: data.answerId,
          textAnswer: data.textAnswer,
          isCorrect,
          pointsEarned,
          timeSpent: data.timeSpent
        },
        create: {
          attemptId: data.attemptId,
          questionId: data.questionId,
          answerId: data.answerId,
          textAnswer: data.textAnswer,
          isCorrect,
          pointsEarned,
          timeSpent: data.timeSpent
        }
      });

      return answer;
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async submitQuizAttempt(data: SubmitQuizAttemptRequest) {
    try {
      const attempt = await QuizRepository.getQuizAttempt(data.attemptId);
      if (!attempt) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Quiz attempt not found'
        });
      }

      if (attempt.status !== 'IN_PROGRESS') {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'Quiz attempt is not in progress'
        });
      }

      // Submit all answers
      for (const answerData of data.answers) {
        await this.submitQuizAnswer(answerData);
      }

      // Calculate final score
      const updatedAttempt = await QuizRepository.getQuizAttempt(data.attemptId);
      const answers = updatedAttempt!.answers;

      const totalScore = answers.reduce((sum, answer) => sum + answer.pointsEarned, 0);
      const correctAnswers = answers.filter(answer => answer.isCorrect).length;
      const wrongAnswers = answers.filter(answer => !answer.isCorrect && answer.pointsEarned < 0).length;
      const skippedAnswers = answers.filter(answer => !answer.isCorrect && answer.pointsEarned === 0).length;
      const percentage = (totalScore / updatedAttempt!.maxScore) * 100;

      // Update attempt
      const finalAttempt = await prisma.quizAttempt.update({
        where: { id: data.attemptId },
        data: {
          status: 'COMPLETED',
          submittedAt: new Date(),
          totalScore,
          percentage,
          correctAnswers,
          wrongAnswers,
          skippedAnswers,
          timeSpent: attempt.quiz.isTimed ? 
            (attempt.quiz.timeLimit! * 60) - (updatedAttempt!.timeRemaining || 0) : 
            undefined
        }
      });

      // Update performance record
      await this.updateQuizPerformance(attempt.quizId, attempt.studentId);

      return this.formatQuizAttemptResponse(finalAttempt);
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  // Performance and Analytics
  static async getQuizPerformance(quizId: string, studentId: string) {
    try {
      const performance = await QuizRepository.getQuizPerformance(quizId, studentId);
      if (!performance) {
        throw new AppError({
          errorType: 'Not Found',
          message: 'Quiz performance not found'
        });
      }
      return this.formatQuizPerformanceResponse(performance);
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async getQuizLeaderboard(quizId: string, limit: number = 10) {
    try {
      const leaderboard = await QuizRepository.getQuizLeaderboard(quizId, limit);
      const quiz = await QuizRepository.getQuizById(quizId);
      
      return {
        quizId,
        quizTitle: quiz?.title || 'Unknown Quiz',
        leaderboard
      } as QuizLeaderboardResponse;
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  static async getQuizStats() {
    try {
      const stats = await QuizRepository.getQuizStats();
      return stats as QuizStatsResponse;
    } catch (error) {
      rethrowAppError(error, 'Operation failed');
    }
  }

  // Helper Methods
  private static validateQuestionData(data: CreateQuestionRequest | UpdateQuestionRequest) {
    if (!data.answers || data.answers.length === 0) {
      throw new AppError({
        errorType: 'Bad Request',
        message: 'At least one answer is required'
      });
    }

    if (data.type === QuestionType.MULTIPLE_CHOICE || data.type === QuestionType.TRUE_FALSE) {
      const correctAnswers = data.answers.filter(a => a.isCorrect);
      if (correctAnswers.length === 0) {
        throw new AppError({
          errorType: 'Bad Request',
          message: 'At least one correct answer is required'
        });
      }
    }
  }

  private static async updateQuizPerformance(quizId: string, studentId: string) {
    const attempts = await QuizRepository.getStudentQuizAttempts(quizId, studentId);
    if (attempts.length === 0) return;

    const bestAttempt = attempts.reduce((best, current) => 
      current.percentage > best.percentage ? current : best
    );

    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.totalScore, 0);
    const averageScore = totalScore / attempts.length;
    const averageTime = attempts.reduce((sum, attempt) => 
      sum + (attempt.timeSpent || 0), 0) / attempts.length;

    const scoreImprovement = attempts.length > 1 ? 
      attempts[attempts.length - 1].percentage - attempts[0].percentage : 0;

    await prisma.quizPerformance.upsert({
      where: {
        quizId_studentId: { quizId, studentId }
      },
      update: {
        bestScore: bestAttempt.totalScore,
        bestPercentage: bestAttempt.percentage,
        totalAttempts: attempts.length,
        averageScore,
        averageTime,
        scoreImprovement,
        lastAttemptAt: bestAttempt.submittedAt || bestAttempt.startedAt
      },
      create: {
        quizId,
        studentId,
        bestScore: bestAttempt.totalScore,
        bestPercentage: bestAttempt.percentage,
        totalAttempts: attempts.length,
        averageScore,
        averageTime,
        scoreImprovement,
        lastAttemptAt: bestAttempt.submittedAt || bestAttempt.startedAt
      }
    });
  }

  // Format Response Methods
  private static formatQuizResponse(quiz: any): QuizResponse {
    // Determine quiz level and associated content
    let quizLevel: 'standalone' | 'subject' | 'chapter' | 'lesson' | 'video' | 'term' = 'standalone';
    let associatedContent: any = null;

    if (quiz.lessonId && quiz.lesson) {
      quizLevel = 'lesson';
      associatedContent = {
        type: 'lesson' as const,
        id: quiz.lesson.id,
        name: quiz.lesson.name,
        chapter: {
          id: quiz.lesson.chapter.id,
          name: quiz.lesson.chapter.name,
          subject: {
            id: quiz.lesson.chapter.subject.id,
            name: quiz.lesson.chapter.subject.name,
            code: quiz.lesson.chapter.subject.code
          }
        }
      };
    } else if (quiz.chapterId && quiz.chapter) {
      quizLevel = 'chapter';
      associatedContent = {
        type: 'chapter' as const,
        id: quiz.chapter.id,
        name: quiz.chapter.name,
        code: quiz.chapter.code,
        subject: {
          id: quiz.chapter.subject.id,
          name: quiz.chapter.subject.name,
          code: quiz.chapter.subject.code
        }
      };
    } else if (quiz.subjectId && quiz.subject) {
      quizLevel = 'subject';
      associatedContent = {
        type: 'subject' as const,
        id: quiz.subject.id,
        name: quiz.subject.name,
        code: quiz.subject.code
      };
    } else if (quiz.termId && quiz.term) {
      quizLevel = 'term';
      associatedContent = {
        type: 'term' as const,
        id: quiz.term.id,
        name: quiz.term.name,
        code: quiz.term.code
      };
    }

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      quizLevel,
      associatedContent,
      // Legacy fields for backward compatibility
      lessonId: quiz.lessonId,
      chapterId: quiz.chapterId,
      subjectId: quiz.subjectId,
      termId: quiz.termId,
      isTimed: quiz.isTimed,
      timeLimit: quiz.timeLimit,
      isActive: quiz.isActive,
      allowRetake: quiz.allowRetake,
      maxAttempts: quiz.maxAttempts,
      hasNegativeMarking: quiz.hasNegativeMarking,
      negativeMarkRatio: quiz.negativeMarkRatio,
      paceType: quiz.paceType,
      difficulty: quiz.difficulty,
      startDate: quiz.startDate?.toISOString(),
      endDate: quiz.endDate?.toISOString(),
      questionCount: quiz.questions?.length || 0,
      totalPoints: quiz.questions?.reduce((sum: number, qq: any) => 
        sum + (qq.points || qq.question.points), 0) || 0,
      createdAt: quiz.createdAt.toISOString(),
      updatedAt: quiz.updatedAt.toISOString()
    };
  }

  private static formatQuestionResponse(question: any, order?: number, quizPoints?: number): QuestionResponse {
    return {
      id: question.id,
      content: question.content,
      type: question.type,
      difficulty: question.difficulty,
      imageUrl: question.imageUrl,
      videoUrl: question.videoUrl,
      audioUrl: question.audioUrl,
      points: question.points,
      explanation: question.explanation,
      tags: question.tags,
      answers: question.answers?.map((answer: any) => ({
        id: answer.id,
        content: answer.content,
        isCorrect: answer.isCorrect,
        position: answer.position,
        imageUrl: answer.imageUrl
      })) || [],
      position: order,
      quizPoints
    };
  }

  private static formatQuizAttemptResponse(attempt: any): QuizAttemptResponse {
    return {
      id: attempt.id,
      quizId: attempt.quizId,
      studentId: attempt.studentId,
      attemptNumber: attempt.attemptNumber,
      status: attempt.status,
      startedAt: attempt.startedAt.toISOString(),
      submittedAt: attempt.submittedAt?.toISOString(),
      totalScore: attempt.totalScore,
      maxScore: attempt.maxScore,
      percentage: attempt.percentage,
      correctAnswers: attempt.correctAnswers,
      wrongAnswers: attempt.wrongAnswers,
      skippedAnswers: attempt.skippedAnswers,
      timeSpent: attempt.timeSpent,
      timeRemaining: attempt.timeRemaining,
      quiz: this.formatQuizResponse(attempt.quiz)
    };
  }

  private static formatQuizPerformanceResponse(performance: any): QuizPerformanceResponse {
    return {
      id: performance.id,
      quizId: performance.quizId,
      studentId: performance.studentId,
      student: {
        id: performance.student.id,
        name: performance.student.name,
        email: performance.student.email
      },
      bestScore: performance.bestScore,
      bestPercentage: performance.bestPercentage,
      totalAttempts: performance.totalAttempts,
      averageScore: performance.averageScore,
      averageTime: performance.averageTime,
      rankInQuiz: performance.rankInQuiz,
      rankInClass: performance.rankInClass,
      scoreImprovement: performance.scoreImprovement,
      lastAttemptAt: performance.lastAttemptAt?.toISOString(),
      quiz: {
        id: performance.quiz.id,
        title: performance.quiz.title,
        difficulty: performance.quiz.difficulty
      }
    };
  }
}
