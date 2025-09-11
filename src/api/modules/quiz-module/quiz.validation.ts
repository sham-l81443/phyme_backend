import { z } from 'zod';
import { QuestionType, Difficulty, PaceType } from '@prisma/client';

// Quiz Validation Schemas
export const createQuizSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  lessonId: z.string().uuid('Invalid lesson ID'),
  isTimed: z.boolean().default(false),
  timeLimit: z.number().min(1, 'Time limit must be at least 1 minute').max(300, 'Time limit must be less than 300 minutes').optional(),
  isActive: z.boolean().default(true),
  allowRetake: z.boolean().default(true),
  maxAttempts: z.number().min(1, 'Max attempts must be at least 1').max(10, 'Max attempts must be less than 10').default(2),
  hasNegativeMarking: z.boolean().default(false),
  negativeMarkRatio: z.number().min(0, 'Negative mark ratio must be positive').max(1, 'Negative mark ratio must be less than or equal to 1').optional(),
  paceType: z.nativeEnum(PaceType).default('NORMAL'),
  difficulty: z.nativeEnum(Difficulty).default('MEDIUM'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
}).refine((data) => {
  if (data.isTimed && !data.timeLimit) {
    return false;
  }
  return true;
}, {
  message: 'Time limit is required for timed quizzes',
  path: ['timeLimit']
}).refine((data) => {
  if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
    return false;
  }
  return true;
}, {
  message: 'Start date must be before end date',
  path: ['endDate']
});

export const updateQuizSchema = z.object({
  id: z.string().uuid('Invalid quiz ID'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  lessonId: z.string().uuid('Invalid lesson ID').optional(),
  isTimed: z.boolean().optional(),
  timeLimit: z.number().min(1, 'Time limit must be at least 1 minute').max(300, 'Time limit must be less than 300 minutes').optional(),
  isActive: z.boolean().optional(),
  allowRetake: z.boolean().optional(),
  maxAttempts: z.number().min(1, 'Max attempts must be at least 1').max(10, 'Max attempts must be less than 10').optional(),
  hasNegativeMarking: z.boolean().optional(),
  negativeMarkRatio: z.number().min(0, 'Negative mark ratio must be positive').max(1, 'Negative mark ratio must be less than or equal to 1').optional(),
  paceType: z.nativeEnum(PaceType).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
}).refine((data) => {
  if (data.isTimed && !data.timeLimit) {
    return false;
  }
  return true;
}, {
  message: 'Time limit is required for timed quizzes',
  path: ['timeLimit']
}).refine((data) => {
  if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
    return false;
  }
  return true;
}, {
  message: 'Start date must be before end date',
  path: ['endDate']
});

// Question Validation Schemas
export const createAnswerSchema = z.object({
  content: z.string().min(1, 'Answer content is required').max(500, 'Answer content must be less than 500 characters'),
  isCorrect: z.boolean().default(false),
  order: z.number().min(0, 'Order must be non-negative').default(0),
  imageUrl: z.string().url('Invalid image URL').optional()
});

export const createQuestionSchema = z.object({
  content: z.string().min(1, 'Question content is required').max(2000, 'Question content must be less than 2000 characters'),
  type: z.nativeEnum(QuestionType),
  difficulty: z.nativeEnum(Difficulty).default('MEDIUM'),
  imageUrl: z.string().url('Invalid image URL').optional(),
  videoUrl: z.string().url('Invalid video URL').optional(),
  audioUrl: z.string().url('Invalid audio URL').optional(),
  points: z.number().min(0.1, 'Points must be at least 0.1').max(100, 'Points must be less than 100').default(1),
  explanation: z.string().max(1000, 'Explanation must be less than 1000 characters').optional(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).max(10, 'Maximum 10 tags allowed').default([]),
  answers: z.array(createAnswerSchema).min(1, 'At least one answer is required').max(10, 'Maximum 10 answers allowed')
}).refine((data) => {
  if (data.type === QuestionType.MULTIPLE_CHOICE || data.type === QuestionType.TRUE_FALSE) {
    const correctAnswers = data.answers.filter(a => a.isCorrect);
    return correctAnswers.length > 0;
  }
  return true;
}, {
  message: 'At least one correct answer is required for multiple choice and true/false questions',
  path: ['answers']
});

export const updateQuestionSchema = z.object({
  id: z.string().uuid('Invalid question ID'),
  content: z.string().min(1, 'Question content is required').max(2000, 'Question content must be less than 2000 characters').optional(),
  type: z.nativeEnum(QuestionType).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  videoUrl: z.string().url('Invalid video URL').optional(),
  audioUrl: z.string().url('Invalid audio URL').optional(),
  points: z.number().min(0.1, 'Points must be at least 0.1').max(100, 'Points must be less than 100').optional(),
  explanation: z.string().max(1000, 'Explanation must be less than 1000 characters').optional(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).max(10, 'Maximum 10 tags allowed').optional(),
  answers: z.array(createAnswerSchema).min(1, 'At least one answer is required').max(10, 'Maximum 10 answers allowed').optional()
}).refine((data) => {
  if (data.answers && (data.type === QuestionType.MULTIPLE_CHOICE || data.type === QuestionType.TRUE_FALSE)) {
    const correctAnswers = data.answers.filter(a => a.isCorrect);
    return correctAnswers.length > 0;
  }
  return true;
}, {
  message: 'At least one correct answer is required for multiple choice and true/false questions',
  path: ['answers']
});

// Quiz Question Assignment Schemas
export const assignQuestionToQuizSchema = z.object({
  quizId: z.string().uuid('Invalid quiz ID'),
  questionId: z.string().uuid('Invalid question ID'),
  order: z.number().min(0, 'Order must be non-negative').default(0),
  points: z.number().min(0.1, 'Points must be at least 0.1').max(100, 'Points must be less than 100').optional()
});

export const bulkAssignQuestionsSchema = z.object({
  quizId: z.string().uuid('Invalid quiz ID'),
  questionIds: z.array(z.string().uuid('Invalid question ID')).min(1, 'At least one question ID is required').max(100, 'Maximum 100 questions allowed'),
  points: z.number().min(0.1, 'Points must be at least 0.1').max(100, 'Points must be less than 100').optional()
});

// Quiz Taking Schemas
export const startQuizAttemptSchema = z.object({
  quizId: z.string().uuid('Invalid quiz ID')
});

export const submitQuizAnswerSchema = z.object({
  attemptId: z.string().uuid('Invalid attempt ID'),
  questionId: z.string().uuid('Invalid question ID'),
  answerId: z.string().uuid('Invalid answer ID').optional(),
  textAnswer: z.string().max(1000, 'Text answer must be less than 1000 characters').optional(),
  timeSpent: z.number().min(0, 'Time spent must be non-negative').optional()
}).refine((data) => {
  return data.answerId || data.textAnswer;
}, {
  message: 'Either answerId or textAnswer must be provided',
  path: ['answerId', 'textAnswer']
});

export const submitQuizAttemptSchema = z.object({
  attemptId: z.string().uuid('Invalid attempt ID'),
  answers: z.array(submitQuizAnswerSchema).min(1, 'At least one answer is required')
});

// Query Parameter Schemas
export const quizSearchQuerySchema = z.object({
  lessonId: z.string().uuid('Invalid lesson ID').optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  paceType: z.nativeEnum(PaceType).optional(),
  isTimed: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  isActive: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  search: z.string().max(100, 'Search term must be less than 100 characters').optional(),
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1, 'Page must be at least 1')).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must be less than 100')).optional(),
  sortBy: z.enum(['createdAt', 'title', 'difficulty']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const questionSearchQuerySchema = z.object({
  type: z.nativeEnum(QuestionType).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  tags: z.string().transform(val => val.split(',')).optional(),
  search: z.string().max(100, 'Search term must be less than 100 characters').optional(),
  page: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1, 'Page must be at least 1')).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must be less than 100')).optional(),
  sortBy: z.enum(['createdAt', 'content', 'difficulty']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

// Bulk Operations Schemas
export const bulkCreateQuestionsSchema = z.object({
  questions: z.array(createQuestionSchema).min(1, 'At least one question is required').max(50, 'Maximum 50 questions allowed')
});

export const bulkUpdateQuestionsSchema = z.object({
  questions: z.array(updateQuestionSchema).min(1, 'At least one question is required').max(50, 'Maximum 50 questions allowed')
});

// Quiz Performance Schemas
export const quizPerformanceQuerySchema = z.object({
  quizId: z.string().uuid('Invalid quiz ID'),
  studentId: z.string().uuid('Invalid student ID').optional()
});

export const quizLeaderboardQuerySchema = z.object({
  quizId: z.string().uuid('Invalid quiz ID'),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must be less than 100')).optional()
});
