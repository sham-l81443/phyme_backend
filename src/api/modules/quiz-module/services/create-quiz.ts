import { CreateQuizRequest } from '../quiz.types';
import { AppError } from '../../../../core/utils/errors/AppError';
import { rethrowAppError } from '../../../../core/utils/errors/rethrowError';
import createQuizRepository from '../repository/create-quiz';

async function createQuizService(data: CreateQuizRequest, createdBy: string) {
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

    const quiz = await createQuizRepository({ ...data, createdBy });
    return quiz;
  } catch (error) {
    rethrowAppError(error, 'Operation failed');
  }
}

export { createQuizService };
export default createQuizService;