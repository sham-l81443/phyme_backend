import prisma from '../../../../core/lib/prisma';
import { CreateQuestionRequest } from '../quiz.types';

export const createQuestionRepository = async (data: CreateQuestionRequest & { createdBy: string }) => {
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
          position: answer.position,
          imageUrl: answer.imageUrl
        }))
      }
    },
    include: {
      answers: {
        orderBy: { position: 'asc' }
      }
    }
  });
};

export default createQuestionRepository;
