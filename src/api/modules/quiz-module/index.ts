// Quiz Module Exports
export { QuizController } from './quiz.controller';
export { QuizService } from './quiz.service';
export { QuizRepository } from './quiz.repository';
export { QUIZ_ENDPOINTS } from './quiz.endpoints';

// Types
export type {
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

// Validation Schemas
export {
  createQuizSchema,
  updateQuizSchema,
  createQuestionSchema,
  updateQuestionSchema,
  assignQuestionToQuizSchema,
  bulkAssignQuestionsSchema,
  startQuizAttemptSchema,
  submitQuizAnswerSchema,
  submitQuizAttemptSchema,
  quizSearchQuerySchema,
  questionSearchQuerySchema,
  bulkCreateQuestionsSchema,
  bulkUpdateQuestionsSchema,
  quizPerformanceQuerySchema,
  quizLeaderboardQuerySchema
} from './quiz.validation';

// Routes
export { default as quizRoutes } from './quiz.routes';
