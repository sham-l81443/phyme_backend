import prisma from "@/core/lib/prisma";

export class TermRepository {
    


    static createTerm = async ({name, code, syllabusId, description, isActive}: {name: string, code: string, syllabusId: string, description?: string, isActive?: boolean}) => {

        const newTerm = await prisma.term.create({
            data: {
                name,
                code,
                syllabusId,
                description,
            }
        })

        return newTerm
    }


    static findUniqueTermByCode = async ({code}: {code?: string}) => {
        const findUniqueTerm = await prisma.term.findUnique({
            where: {
                code,
            }
        })
        return findUniqueTerm
    }
}
