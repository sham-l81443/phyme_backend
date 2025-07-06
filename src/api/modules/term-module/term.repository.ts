import prisma from "@/core/lib/prisma";

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

    static findAll = async () => {
        const findAllTerms = await prisma.term.findMany({
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
}
