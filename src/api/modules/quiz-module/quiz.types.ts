import { QuestionType, Difficulty, PaceType, AttemptStatus } from '@prisma/client';

// Quiz Creation Types
export interface CreateQuizRequest {
  title: string;
  description?: string;
  lessonId: string;
  isTimed: boolean;
  timeLimit?: number; // in minutes
  isActive: boolean;
  allowRetake: boolean;
  maxAttempts: number;
  hasNegativeMarking: boolean;
  negativeMarkRatio?: number;
  paceType: PaceType;
  difficulty: Difficulty;
  startDate?: string;
  endDate?: string;
}

export interface UpdateQuizRequest extends Partial<CreateQuizRequest> {
  id: string;
}

// Question Creation Types
export interface CreateQuestionRequest {
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  points: number;
  explanation?: string;
  tags: string[];
  answers: CreateAnswerRequest[];
}

export interface CreateAnswerRequest {
  content: string;
  isCorrect: boolean;
  order: number;
  imageUrl?: string;
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {
  id: string;
}

// Quiz Question Assignment
export interface AssignQuestionToQuizRequest {
  quizId: string;
  questionId: string;
  order?: number;
  points?: number;
}

// Quiz Taking Types
export interface StartQuizAttemptRequest {
  quizId: string;
}

export interface SubmitQuizAnswerRequest {
  attemptId: string;
  questionId: string;
  answerId?: string; // For multiple choice
  textAnswer?: string; // For text-based answers
  timeSpent?: number; // Time spent on this question in seconds
}

export interface SubmitQuizAttemptRequest {
  attemptId: string;
  answers: SubmitQuizAnswerRequest[];
}

// Response Types
export interface QuizResponse {
  id: string;
  title: string;
  description?: string;
  lessonId: string;
  lesson: {
    id: string;
    name: string;
    chapter: {
      id: string;
      name: string;
      subject: {
        id: string;
        name: string;
      };
    };
  };
  isTimed: boolean;
  timeLimit?: number;
  isActive: boolean;
  allowRetake: boolean;
  maxAttempts: number;
  hasNegativeMarking: boolean;
  negativeMarkRatio?: number;
  paceType: PaceType;
  difficulty: Difficulty;
  startDate?: string;
  endDate?: string;
  questionCount: number;
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionResponse {
  id: string;
  content: string;
  type: QuestionType;
  difficulty: Difficulty;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  points: number;
  explanation?: string;
  tags: string[];
  answers: AnswerResponse[];
  order?: number; // Order in quiz
  quizPoints?: number; // Points for this question in this quiz
}

export interface AnswerResponse {
  id: string;
  content: string;
  isCorrect: boolean;
  order: number;
  imageUrl?: string;
}

export interface QuizAttemptResponse {
  id: string;
  quizId: string;
  studentId: string;
  attemptNumber: number;
  status: AttemptStatus;
  startedAt: string;
  submittedAt?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  timeSpent?: number;
  timeRemaining?: number;
  quiz: QuizResponse;
}

export interface QuizPerformanceResponse {
  id: string;
  quizId: string;
  studentId: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  bestScore: number;
  bestPercentage: number;
  totalAttempts: number;
  averageScore: number;
  averageTime?: number;
  rankInQuiz?: number;
  rankInClass?: number;
  scoreImprovement?: number;
  lastAttemptAt?: string;
  quiz: {
    id: string;
    title: string;
    difficulty: Difficulty;
  };
}

export interface QuizLeaderboardResponse {
  quizId: string;
  quizTitle: string;
  leaderboard: {
    rank: number;
    studentId: string;
    studentName: string;
    bestScore: number;
    bestPercentage: number;
    totalAttempts: number;
    lastAttemptAt: string;
  }[];
}

export interface QuizAnalyticsResponse {
  quizId: string;
  quizTitle: string;
  totalAttempts: number;
  averageScore: number;
  averageTime?: number;
  completionRate: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
    expert: number;
  };
  questionAnalytics: {
    questionId: string;
    questionContent: string;
    correctRate: number;
    averageTime: number;
    difficulty: Difficulty;
  }[];
  performanceOverTime: {
    date: string;
    averageScore: number;
    attemptCount: number;
  }[];
}

// Quiz Taking Session Types
export interface QuizSessionResponse {
  attemptId: string;
  quiz: QuizResponse;
  questions: QuestionResponse[];
  timeRemaining?: number;
  currentQuestionIndex: number;
  totalQuestions: number;
}

// Search and Filter Types
export interface QuizSearchParams {
  lessonId?: string;
  difficulty?: Difficulty;
  paceType?: PaceType;
  isTimed?: boolean;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'title' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
}

export interface QuestionSearchParams {
  type?: QuestionType;
  difficulty?: Difficulty;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'content' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
}

// Bulk Operations
export interface BulkAssignQuestionsRequest {
  quizId: string;
  questionIds: string[];
  points?: number; // Apply same points to all questions
}

export interface BulkCreateQuestionsRequest {
  questions: CreateQuestionRequest[];
}

export interface BulkUpdateQuestionsRequest {
  questions: UpdateQuestionRequest[];
}

// Quiz Statistics
export interface QuizStatsResponse {
  totalQuizzes: number;
  activeQuizzes: number;
  totalQuestions: number;
  totalAttempts: number;
  averageCompletionRate: number;
  topPerformingQuizzes: {
    quizId: string;
    quizTitle: string;
    averageScore: number;
    attemptCount: number;
  }[];
  recentActivity: {
    type: 'quiz_created' | 'quiz_attempted' | 'quiz_completed';
    description: string;
    timestamp: string;
  }[];
}
