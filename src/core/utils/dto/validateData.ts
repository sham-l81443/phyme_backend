import { Schema } from "zod";
import { AppError } from "../errors/AppError";
import { rethrowAppError } from "../errors/rethrowError";

const validateDto = <T>(schema: Schema<T>, data: unknown): T => {


    try {

        if (!data) {
            throw new AppError({ errorType: 'Bad Request', message: 'Invalid request body' })

        }

        const result = schema.safeParse(data);


        if (!result.success) {
            console.log('Validation errors:', result.error.issues);
            throw new AppError({ errorType: 'Bad Request', data: result.error.issues.map((issue) => issue.message).join(', '), message: 'Invalid request body' })
        }

        return result.data as T;

    } catch (error) {

        rethrowAppError(error, 'Invalid request body ')

    }


}


export { validateDto }