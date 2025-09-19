import { Request, Response, NextFunction } from 'express';
import createSuccessResponse from '../../../../core/utils/responseCreator';
import { AppError } from '../../../../core/utils/errors/AppError';
import { IAdminAccessToken } from '../../../../core/schema';
import { validateDto } from '../../../../core/utils';
import { createQuizSchema } from '../quiz.validation';
import createQuizService from '../services/create-quiz';

async function createQuizController(req: Request, res: Response, next: NextFunction) {
  try {
    // Validate request data using validateDto
    const validatedData = validateDto(createQuizSchema, req.body);
    console.log(validatedData);
    
    const user = req.user as IAdminAccessToken;
    console.log('User object:', user);
    const createdBy = user?.id;
    console.log('CreatedBy:', createdBy);

    if (!createdBy) {
      throw new AppError({
        errorType: 'Unauthorized',
        message: 'User not authenticated'
      });
    }

    const quiz = await createQuizService(validatedData, createdBy);

    res.status(201).json(
      createSuccessResponse({
        data: quiz,
        message: 'Quiz created successfully'
      })  
    );
  } catch (error) {
    next(error);
  }
}

export { createQuizController };
export default createQuizController;