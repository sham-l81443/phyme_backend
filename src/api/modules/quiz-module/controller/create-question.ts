import { Request, Response, NextFunction } from 'express';
import createSuccessResponse from '../../../../core/utils/responseCreator';
import { AppError } from '../../../../core/utils/errors/AppError';
import { IAdminAccessToken } from '../../../../core/schema';
import { validateDto } from '../../../../core/utils';
import { z } from 'zod';
import { createRequiredStringSchema, createRequiredNumberSchema } from '../../../../core/constants/validationSchema';
import createQuestionService from '../services/create-question';


// Answer validation schema
export const createAnswerSchema = z.object({
  content: createRequiredStringSchema('Answer content').max(500, 'Answer content must be less than 500 characters'),
  isCorrect: z.boolean({ message: 'isCorrect field is required' }),
  position: z.number().optional(),
  imageUrl: z.string().optional().refine((val) => !val || /^https?:\/\/.+/.test(val), {
    message: 'Invalid image URL'
  })
});

// Question validation schema
export const createQuestionSchema = z.object({
  content: createRequiredStringSchema('Question content').max(2000, 'Question content must be less than 2000 characters'),
  type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_IN_BLANK', 'SHORT_ANSWER', 'LONG_ANSWER', 'MATCHING', 'ORDERING', 'DRAG_DROP', 'AUDIO_QUESTION', 'VIDEO_QUESTION', 'IMAGE_QUESTION'], { message: 'Question type is required' }),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT'], { message: 'Difficulty is required' }),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  audioUrl: z.string().optional(),
  points: createRequiredNumberSchema('Points').min(0.1, 'Points must be at least 0.1').max(100, 'Points must be less than 100'),
  explanation: z.string().max(1000, 'Explanation must be less than 1000 characters').optional(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).max(10, 'Maximum 10 tags allowed').default([]),
  answers: z.array(createAnswerSchema).min(2, 'At least two answers are required').max(10, 'Maximum 10 answers allowed')
}).refine((data) => {
  if (data.type === 'MULTIPLE_CHOICE' || data.type === 'TRUE_FALSE') {
    const correctAnswers = data.answers.filter(a => a.isCorrect);
    return correctAnswers.length > 0;
  }
  return true;
}, {
  message: 'At least one correct answer is required for multiple choice and true/false questions',
  path: ['answers']
});

async function createQuestionController(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('Creating question', req.body);
    // Validate request data using validateDto
    const validatedData = validateDto(createQuestionSchema, req.body);
    console.log('Validated data:', validatedData);
    
    const user = req.user as IAdminAccessToken;
    const createdBy = user?.id;
    
    const question = await createQuestionService(validatedData, createdBy);

    res.status(201).json(
      createSuccessResponse({
        data: question,
        message: 'Question created successfully'
      })
    );
  } catch (error) {
    next(error);
  }
}

export { createQuestionController };
