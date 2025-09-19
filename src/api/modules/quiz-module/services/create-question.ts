import { AppError } from '../../../../core/utils/errors/AppError';
import { rethrowAppError } from '../../../../core/utils/errors/rethrowError';
import createQuestionRepository from '../repository/create-question';

// Helper function to format question response
function formatQuestionResponse(question: any) {
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
    createdAt: question.createdAt.toISOString(),
    updatedAt: question.updatedAt.toISOString()
  };
}

async function createQuestionService(data: any, createdBy: string) {
  try {
    const question = await createQuestionRepository({ ...data, createdBy });
    return formatQuestionResponse(question);
  } catch (error) {
    rethrowAppError(error, 'Operation failed');
  }
}

export { createQuestionService };
export default createQuestionService;
