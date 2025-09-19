import prisma from '../../../../core/lib/prisma';
import { CreateQuizRequest } from '../quiz.types';

export const createQuizRepository = async (data: CreateQuizRequest & { createdBy: string }) => {
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
      chapter: {
        include: {
          subject: true
        }
      },
      subject: true,
      term: true,
      questions: {
        include: {
          question: {
            include: {
              answers: true
            }
          }
        },
        orderBy: { position: 'asc' }
      }
    }
  });
};

export default createQuizRepository;