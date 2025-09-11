import prisma from '../../../core/lib/prisma';
import { 
  CreateQuizRequest, 
  UpdateQuizRequest, 
  QuizSearchParams,
  QuestionSearchParams,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  AssignQuestionToQuizRequest,
  BulkAssignQuestionsRequest
} from './quiz.types';
import { Prisma } from '@prisma/client';

export class QuizRepository {
  // Quiz CRUD Operations
  static async createQuiz(data: CreateQuizRequest & { createdBy: string }) {
    return await prisma.quiz.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                subject: true
              }
            }
          }
        },
        questions: {
          include: {
            question: {
              include: {
                answers: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  static async getQuizById(id: string) {
    return await prisma.quiz.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                subject: true
              }
            }
          }
        },
        questions: {
          include: {
            question: {
              include: {
                answers: true
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        attempts: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  static async getQuizzesByLesson(lessonId: string) {
    return await prisma.quiz.findMany({
      where: { lessonId },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                subject: true
              }
            }
          }
        },
        questions: {
          include: {
            question: true
          }
        },
        _count: {
          select: {
            attempts: true,
            questions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async searchQuizzes(params: QuizSearchParams) {
    const {
      lessonId,
      difficulty,
      paceType,
      isTimed,
      isActive,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    const where: Prisma.QuizWhereInput = {};

    if (lessonId) where.lessonId = lessonId;
    if (difficulty) where.difficulty = difficulty;
    if (paceType) where.paceType = paceType;
    if (isTimed !== undefined) where.isTimed = isTimed;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder } as Prisma.QuizOrderByWithRelationInput;

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        include: {
          lesson: {
            include: {
              chapter: {
                include: {
                  subject: true
                }
              }
            }
          },
          _count: {
            select: {
              attempts: true,
              questions: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.quiz.count({ where })
    ]);

    return { quizzes, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async updateQuiz(id: string, data: UpdateQuizRequest) {
    return await prisma.quiz.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                subject: true
              }
            }
          }
        },
        questions: {
          include: {
            question: {
              include: {
                answers: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  static async deleteQuiz(id: string) {
    return await prisma.quiz.delete({
      where: { id }
    });
  }

  // Question CRUD Operations
  static async createQuestion(data: CreateQuestionRequest & { createdBy: string }) {
    return await prisma.question.create({
      data: {
        content: data.content,
        type: data.type,
        difficulty: data.difficulty,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        audioUrl: data.audioUrl,
        points: data.points,
        explanation: data.explanation,
        tags: data.tags,
        createdBy: data.createdBy,
        answers: {
          create: data.answers.map(answer => ({
            content: answer.content,
            isCorrect: answer.isCorrect,
            order: answer.order,
            imageUrl: answer.imageUrl
          }))
        }
      },
      include: {
        answers: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  static async getQuestionById(id: string) {
    return await prisma.question.findUnique({
      where: { id },
      include: {
        answers: {
          orderBy: { order: 'asc' }
        },
        quizQuestions: {
          include: {
            quiz: {
              include: {
                lesson: {
                  include: {
                    chapter: {
                      include: {
                        subject: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  static async searchQuestions(params: QuestionSearchParams) {
    const {
      type,
      difficulty,
      tags,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    const where: Prisma.QuestionWhereInput = {};

    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags
      };
    }
    if (search) {
      where.content = { contains: search, mode: 'insensitive' };
    }

    const skip = (page - 1) * limit;
    const orderBy = { [sortBy]: sortOrder } as Prisma.QuestionOrderByWithRelationInput;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          answers: {
            orderBy: { order: 'asc' }
          },
          _count: {
            select: {
              quizQuestions: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.question.count({ where })
    ]);

    return { questions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async updateQuestion(id: string, data: UpdateQuestionRequest) {
    return await prisma.question.update({
      where: { id },
      data: {
        content: data.content,
        type: data.type,
        difficulty: data.difficulty,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        audioUrl: data.audioUrl,
        points: data.points,
        explanation: data.explanation,
        tags: data.tags,
        answers: data.answers ? {
          deleteMany: {},
          create: data.answers.map(answer => ({
            content: answer.content,
            isCorrect: answer.isCorrect,
            order: answer.order,
            imageUrl: answer.imageUrl
          }))
        } : undefined
      },
      include: {
        answers: {
          orderBy: { order: 'asc' }
        }
      }
    });
  }

  static async deleteQuestion(id: string) {
    return await prisma.question.delete({
      where: { id }
    });
  }

  // Quiz Question Assignment
  static async assignQuestionToQuiz(data: AssignQuestionToQuizRequest) {
    return await prisma.quizQuestion.create({
      data: {
        quizId: data.quizId,
        questionId: data.questionId,
        order: data.order || 0,
        points: data.points
      },
      include: {
        question: {
          include: {
            answers: true
          }
        }
      }
    });
  }

  static async bulkAssignQuestions(data: BulkAssignQuestionsRequest) {
    const assignments = data.questionIds.map((questionId, index) => ({
      quizId: data.quizId,
      questionId,
      order: index,
      points: data.points
    }));

    return await prisma.quizQuestion.createMany({
      data: assignments,
      skipDuplicates: true
    });
  }

  static async removeQuestionFromQuiz(quizId: string, questionId: string) {
    return await prisma.quizQuestion.delete({
      where: {
        quizId_questionId: {
          quizId,
          questionId
        }
      }
    });
  }

  static async reorderQuizQuestions(quizId: string, questionOrders: { questionId: string; order: number }[]) {
    const updates = questionOrders.map(({ questionId, order }) =>
      prisma.quizQuestion.update({
        where: {
          quizId_questionId: {
            quizId,
            questionId
          }
        },
        data: { order }
      })
    );

    return await Promise.all(updates);
  }

  // Quiz Attempts
  static async createQuizAttempt(quizId: string, studentId: string, attemptNumber: number) {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            question: true
          }
        }
      }
    });

    if (!quiz) throw new Error('Quiz not found');

    const maxScore = quiz.questions.reduce((sum, qq) => sum + (qq.points || qq.question.points), 0);

    return await prisma.quizAttempt.create({
      data: {
        quizId,
        studentId,
        attemptNumber,
        maxScore,
        status: 'IN_PROGRESS'
      },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                chapter: {
                  include: {
                    subject: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  static async getQuizAttempt(attemptId: string) {
    return await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: {
              include: {
                question: {
                  include: {
                    answers: true
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          }
        },
        answers: {
          include: {
            question: {
              include: {
                answers: true
              }
            }
          }
        }
      }
    });
  }

  static async getStudentQuizAttempts(quizId: string, studentId: string) {
    return await prisma.quizAttempt.findMany({
      where: {
        quizId,
        studentId
      },
      include: {
        quiz: true
      },
      orderBy: { attemptNumber: 'asc' }
    });
  }

  // Quiz Performance
  static async getQuizPerformance(quizId: string, studentId: string) {
    return await prisma.quizPerformance.findUnique({
      where: {
        quizId_studentId: {
          quizId,
          studentId
        }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        quiz: {
          select: {
            id: true,
            title: true,
            difficulty: true
          }
        }
      }
    });
  }

  static async getQuizLeaderboard(quizId: string, limit: number = 10) {
    const performances = await prisma.quizPerformance.findMany({
      where: { quizId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { bestPercentage: 'desc' },
      take: limit
    });

    return performances.map((perf, index) => ({
      rank: index + 1,
      studentId: perf.studentId,
      studentName: perf.student.name || 'Unknown',
      bestScore: perf.bestScore,
      bestPercentage: perf.bestPercentage,
      totalAttempts: perf.totalAttempts,
      lastAttemptAt: perf.lastAttemptAt?.toISOString() || ''
    }));
  }

  // Statistics
  static async getQuizStats() {
    const [
      totalQuizzes,
      activeQuizzes,
      totalQuestions,
      totalAttempts,
      averageCompletionRate
    ] = await Promise.all([
      prisma.quiz.count(),
      prisma.quiz.count({ where: { isActive: true } }),
      prisma.question.count(),
      prisma.quizAttempt.count(),
      prisma.quizAttempt.aggregate({
        _avg: {
          percentage: true
        }
      })
    ]);

    return {
      totalQuizzes,
      activeQuizzes,
      totalQuestions,
      totalAttempts,
      averageCompletionRate: averageCompletionRate._avg.percentage || 0
    };
  }
}
