// Quiz Module Endpoints
export const QUIZ_ENDPOINTS = {
  // Quiz Management (Admin)
  QUIZZES: '/quizzes',
  QUIZ_BY_ID: (id: string) => `/quizzes/${id}`,
  QUIZZES_BY_LESSON: (lessonId: string) => `/lessons/${lessonId}/quizzes`,
  QUIZ_SEARCH: '/quizzes/search',
  
  // Question Management (Admin)
  QUESTIONS: '/questions',
  QUESTION_BY_ID: (id: string) => `/questions/${id}`,
  QUESTION_SEARCH: '/questions/search',
  
  // Quiz Question Assignment (Admin)
  ASSIGN_QUESTION_TO_QUIZ: '/quizzes/questions/assign',
  BULK_ASSIGN_QUESTIONS: '/quizzes/questions/bulk-assign',
  REMOVE_QUESTION_FROM_QUIZ: (quizId: string, questionId: string) => `/quizzes/${quizId}/questions/${questionId}`,
  
  // Quiz Taking (Student)
  START_QUIZ_ATTEMPT: '/quizzes/start',
  SUBMIT_QUIZ_ANSWER: '/quizzes/answers/submit',
  SUBMIT_QUIZ_ATTEMPT: '/quizzes/submit',
  
  // Performance and Analytics
  QUIZ_PERFORMANCE: (quizId: string) => `/quizzes/${quizId}/performance`,
  QUIZ_LEADERBOARD: (quizId: string) => `/quizzes/${quizId}/leaderboard`,
  QUIZ_STATS: '/quizzes/stats',
  STUDENT_QUIZ_ATTEMPTS: (quizId: string) => `/quizzes/${quizId}/attempts`,
  
  // Bulk Operations (Admin)
  BULK_CREATE_QUESTIONS: '/questions/bulk-create',
  BULK_UPDATE_QUESTIONS: '/questions/bulk-update',
  BULK_DELETE_QUESTIONS: '/questions/bulk-delete',
  
  // Quiz Analytics (Admin)
  QUIZ_ANALYTICS: (quizId: string) => `/quizzes/${quizId}/analytics`,
  QUESTION_ANALYTICS: (questionId: string) => `/questions/${questionId}/analytics`,
  
  // Quiz Templates (Admin)
  QUIZ_TEMPLATES: '/quizzes/templates',
  CREATE_QUIZ_FROM_TEMPLATE: '/quizzes/from-template',
  
  // Quiz Reports (Admin)
  QUIZ_REPORTS: '/quizzes/reports',
  EXPORT_QUIZ_RESULTS: (quizId: string) => `/quizzes/${quizId}/export`,
  
  // Student Quiz Dashboard
  STUDENT_QUIZ_DASHBOARD: '/student/quizzes/dashboard',
  STUDENT_QUIZ_HISTORY: '/student/quizzes/history',
  STUDENT_QUIZ_PROGRESS: '/student/quizzes/progress',
  
  // Quiz Notifications
  QUIZ_NOTIFICATIONS: '/quizzes/notifications',
  QUIZ_REMINDERS: '/quizzes/reminders',
  
  // Quiz Settings
  QUIZ_SETTINGS: '/quizzes/settings',
  UPDATE_QUIZ_SETTINGS: (quizId: string) => `/quizzes/${quizId}/settings`,
  
  // Quiz Categories
  QUIZ_CATEGORIES: '/quizzes/categories',
  QUIZ_CATEGORY_BY_ID: (id: string) => `/quizzes/categories/${id}`,
  
  // Quiz Tags
  QUIZ_TAGS: '/quizzes/tags',
  QUESTION_TAGS: '/questions/tags',
  
  // Quiz Import/Export
  IMPORT_QUIZ: '/quizzes/import',
  EXPORT_QUIZ: (quizId: string) => `/quizzes/${quizId}/export`,
  IMPORT_QUESTIONS: '/questions/import',
  EXPORT_QUESTIONS: '/questions/export',
  
  // Quiz Scheduling
  QUIZ_SCHEDULE: '/quizzes/schedule',
  QUIZ_AVAILABILITY: (quizId: string) => `/quizzes/${quizId}/availability`,
  
  // Quiz Proctoring (Future Feature)
  QUIZ_PROCTORING: (quizId: string) => `/quizzes/${quizId}/proctoring`,
  QUIZ_MONITORING: (quizId: string) => `/quizzes/${quizId}/monitoring`,
  
  // Quiz Certificates
  QUIZ_CERTIFICATES: '/quizzes/certificates',
  GENERATE_CERTIFICATE: (quizId: string) => `/quizzes/${quizId}/certificate`,
  
  // Quiz Gamification
  QUIZ_ACHIEVEMENTS: '/quizzes/achievements',
  QUIZ_BADGES: '/quizzes/badges',
  QUIZ_LEADERBOARDS: '/quizzes/leaderboards',
  
  // Quiz Mobile App
  MOBILE_QUIZ_SYNC: '/mobile/quizzes/sync',
  OFFLINE_QUIZ_DATA: '/mobile/quizzes/offline',
  
  // Quiz Webhooks
  QUIZ_WEBHOOKS: '/quizzes/webhooks',
  QUIZ_EVENTS: '/quizzes/events'
} as const;

export default QUIZ_ENDPOINTS;
