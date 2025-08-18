import prisma from "src/core/lib/prisma";
import { rethrowAppError } from "src/core/utils/errors/rethrowError";

export class UserRepository {
    static async getStudentByEmail(email: string) {
        try {
            return await prisma.user.findUnique({
                where: { email }, select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    isVerified: true,
                    name: true,
                    phone: true,
                    syllabus: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },

                    class: {
                        select: {
                            name: true,
                            id: true,
                        }
                    },
                    studentSubscription: {
                        select: {
                            id: true,
                            isActive: true,
                            term: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            rethrowAppError(error, 'Failed to get user by email')
        }
    }

    static async getStudentById(id: string) {
        try {
            return await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                    isVerified: true,
                    name: true,
                    phone: true,
                    class: {
                        select: {
                            name: true,
                            id: true,
                        }
                    },
                    studentSubscription: {
                        select: {
                            id: true,
                            isActive: true,
                            term: {
                            }
                        }
                    }
                }
            })
        } catch (error) {
            rethrowAppError(error, 'Failed to get user by id')
        }
    }
}