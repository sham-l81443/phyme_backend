import prisma from "../../../core/lib/prisma";
import { AppError } from "../../../core/utils/errors/AppError";
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { UserValidation } from "./user.validation";
import { User } from "@prisma/client";

export class UserServices {
    static async getUserById({ id }: { id: string }) {

        try {


            const validatedData = UserValidation.validateIdSchema.safeParse({ id })


            if (!validatedData.success) {
                throw new AppError({ errorType: 'Bad Request', message: 'Invalid request body', data: validatedData.error })
            }

            const user = await prisma.user.findUnique({ where: { id: validatedData.data.id } })

            if (!user) {
                throw new AppError({ errorType: 'Not Found', message: 'User not found' })
            }

            return user;
        }
        catch (error) {

            rethrowAppError(error, 'Failed to get user')
        }

    }

    static async updateUserById({ id, data }: { id: string, data: Partial<User> }) {

        try {

            const validatedData = UserValidation.validateIdSchema.safeParse({ id })

            if (!validatedData.success) {
                throw new AppError({ errorType: 'Bad Request', message: 'Invalid request body', data: validatedData.error })
            }

            const user = await prisma.user.update({ where: { id: validatedData.data.id }, data: data })

            if (!user) {
                throw new AppError({ errorType: 'Not Found', message: 'User not found' })
            }

            return user;
        }
        catch (error) {

            rethrowAppError(error, 'Failed to update user')
        }
    }

    static async getAllUserService() {
        try {
            return await prisma.user.findMany({
                include:{
                    class:true,
                    syllabus:true,
                }
            })
        } catch (error) {
            rethrowAppError(error, 'Failed to get all users')
        }
    }
}