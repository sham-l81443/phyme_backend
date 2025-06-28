import { Prisma } from '@prisma/client';
import { logger } from '../logger';
import { AppError } from './AppError';


export const handleRepositoryError = (error: unknown) => {

    if(error instanceof AppError){
        throw error
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        logger.error('PRISMA', error)
        if (error.code === 'P2002') {
            throw new AppError({ message: 'Conflict: Video already exists with same unique id already exist', errorType: 'Conflict' }); // 409
        }
        if (error.code === 'P2003') {
            throw new AppError({ message: 'prisma error: something went wrong', errorType: 'Bad Request' });
        }
        if (error.code === 'P2025') {
            // P2025: "An operation failed because it depends on one or more records that were required but not found."
            throw new AppError({ message: 'Not Found', errorType: 'Not Found' });
          }
    }
    logger.error('DEFAULT', error)

    throw new AppError({ message: 'Internal Server Error', errorType: 'Internal Server Error' });
}

