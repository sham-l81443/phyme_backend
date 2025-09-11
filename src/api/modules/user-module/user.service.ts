import prisma from "../../../core/lib/prisma";
import { AppError } from "../../../core/utils/errors/AppError";
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { UserRepository } from "./user.repository";
import { UserValidation } from "./user.validation";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

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


    static async getStudentDetailsById(id:string){
        try{
            return await UserRepository.getStudentById(id)
        }catch(error){
            rethrowAppError(error,'Failed to get user by email')
        }
    }

    static async verifyUserService({ userId }: { userId: string }) {
        try {
            const validatedData = UserValidation.validateVerifyUserSchema.safeParse({ userId });

            if (!validatedData.success) {
                throw new AppError({ 
                    errorType: 'Bad Request', 
                    message: 'Invalid request body', 
                    data: validatedData.error 
                });
            }

            const user = await prisma.user.findUnique({ 
                where: { id: validatedData.data.userId } 
            });

            if (!user) {
                throw new AppError({ 
                    errorType: 'Not Found', 
                    message: 'User not found' 
                });
            }

            if (user.isVerified) {
                throw new AppError({ 
                    errorType: 'Bad Request', 
                    message: 'User is already verified' 
                });
            }

            const updatedUser = await prisma.user.update({
                where: { id: validatedData.data.userId },
                data: { isVerified: true },
                include: {
                    class: true,
                    syllabus: true
                }
            });

            return updatedUser;
        } catch (error) {
            rethrowAppError(error, 'Failed to verify user');
        }
    }

    static async addPasswordForUserService({ userId, password }: { userId: string, password: string }) {
        try {
            const validatedData = UserValidation.validateAddPasswordSchema.safeParse({ userId, password });

            if (!validatedData.success) {
                throw new AppError({ 
                    errorType: 'Bad Request', 
                    message: 'Invalid request body', 
                    data: validatedData.error 
                });
            }

            const user = await prisma.user.findUnique({ 
                where: { id: validatedData.data.userId } 
            });

            if (!user) {
                throw new AppError({ 
                    errorType: 'Not Found', 
                    message: 'User not found' 
                });
            }

            if (user.password) {
                throw new AppError({ 
                    errorType: 'Bad Request', 
                    message: 'User already has a password set' 
                });
            }

            const hashedPassword = await bcrypt.hash(validatedData.data.password, 12);

            const updatedUser = await prisma.user.update({
                where: { id: validatedData.data.userId },
                data: { password: hashedPassword },
                include: {
                    class: true,
                    syllabus: true
                }
            });

            return updatedUser;
        } catch (error) {
            rethrowAppError(error, 'Failed to add password for user');
        }
    }

    static async getUnverifiedUsersService({ page = 1, limit = 10 }: { page?: number, limit?: number }) {
        try {
            const validatedData = UserValidation.validateGetUnverifiedUsersSchema.safeParse({ 
                page: page.toString(), 
                limit: limit.toString() 
            });

            if (!validatedData.success) {
                throw new AppError({ 
                    errorType: 'Bad Request', 
                    message: 'Invalid pagination parameters', 
                    data: validatedData.error 
                });
            }

            const skip = (validatedData.data.page - 1) * validatedData.data.limit;

            const [users, totalCount] = await Promise.all([
                prisma.user.findMany({
                    where: { 
                        isVerified: false,
                        isActive: true
                    },
                    include: {
                        class: true,
                        syllabus: true
                    },
                    skip,
                    take: validatedData.data.limit,
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.user.count({
                    where: { 
                        isVerified: false,
                        isActive: true
                    }
                })
            ]);

            return {
                users,
                pagination: {
                    page: validatedData.data.page,
                    limit: validatedData.data.limit,
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / validatedData.data.limit)
                }
            };
        } catch (error) {
            rethrowAppError(error, 'Failed to get unverified users');
        }
    }
}