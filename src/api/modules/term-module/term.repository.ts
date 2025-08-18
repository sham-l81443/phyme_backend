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


    static getTermByStudentClassId = async (classId:string) => {
        const getTermByClassId = await prisma.term.findMany({
            where:{
                classId
            },
            select:{
                id:true,
                name:true,
            }
        })
        return getTermByClassId
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