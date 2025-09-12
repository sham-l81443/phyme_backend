import prisma from "../../../core/lib/prisma";

export class TermRepository {



    static createTerm = async ({ name, code, classId, description }: { name: string, code: string, classId: string, description?: string }) => {

        const newTerm = await prisma.term.create({
            data: {
                name,
                code,
                classId,
                description,
            }
        })

        return newTerm
    }


    static findUniqueTermByCode = async ({ code }: { code?: string }) => {
        const findUniqueTerm = await prisma.term.findUnique({
            where: {
                code,
            }
        })
        return findUniqueTerm
    }

    static findAll = async (classId?:string) => {
        const findAllTerms = await prisma.term.findMany({
            where:{
                ...(classId && { classId })
            },
            include: {
                class: true,
                _count: {
                    select: {
                        chapters: true,
                    }
                }
            }
        })
        return findAllTerms
    }


    static getTermByStudentClassId = async (classId:string, studentId?: string) => {
        const terms = await prisma.term.findMany({
            where:{
                classId
            },
            select:{
                id:true,
                name:true,
                code: true,
                description: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: {
                        chapters: true,
                    }
                }
            }
        });

        // If no studentId provided, return terms without subscription status
        if (!studentId) {
            return terms.map(term => ({
                ...term,
                isLocked: true, // Default to locked if no student context
                chapterCount: term._count.chapters
            }));
        }

        // Get user's active subscriptions
        const userSubscriptions = await prisma.studentSubscription.findMany({
            where: {
                studentId,
                isActive: true
            },
            select: { 
                termId: true,
                createdAt: true
            }
        });

        const subscribedTermIds = new Set(userSubscriptions.map(sub => sub.termId));

        // Add isLocked property based on subscription status
        return terms.map(term => ({
            id: term.id,
            name: term.name,
            code: term.code,
            description: term.description,
            isActive: term.isActive,
            createdAt: term.createdAt,
            chapterCount: term._count.chapters,
            isLocked: !subscribedTermIds.has(term.id)
        }));
    }

    static getAllTermService = async () => {
        const getAllTerm = await prisma.term.findMany({
            select:{
                id:true,
                name:true,
                code:true,
                createdAt:true,
                isActive:true,
                class:{
                    select:{
                        name:true,
                        id:true,
                    }
                }
            }
        })
        return getAllTerm
    }
}