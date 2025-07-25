import prisma from "@/core/lib/prisma";

export class SubjectRepository {
    
    static createSubject = async ({ name, code, classId, description }: { name: string, code: string, classId: string, description?: string }) => {

        const newSubject = await prisma.subject.create({
            data: {
                name,
                code,
                classId,
                description
            }
        })

        return newSubject
    }

    static findUniqueSubjectByCode = async ({ code }: { code?: string }) => {
        const findUniqueSubject = await prisma.subject.findUnique({
            where: {
                code,
            }
        })
        return findUniqueSubject
    }


    static findAll = async () => {
        const findAllSubjects = await prisma.subject.findMany({
            include:{
                class:{
                   include:{
                    syllabus:true
                   }
                },
            }
        })
        return findAllSubjects
    }
}
