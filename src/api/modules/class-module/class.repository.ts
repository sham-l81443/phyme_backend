import prisma from "../../../core/lib/prisma";

export class ClassRepository {
    

    static createClass = async ({name, code, syllabusId, description, isActive}: {name: string, code: string, syllabusId: string, description?: string, isActive?: boolean}) => {
        const newClass = await prisma.class.create({
            data: {
                name,
                code,
                syllabusId,
                description,
            }
        })

        return newClass
    }


    static findUniqueClassByCode = async ({code}: {code?: string}) => {
        const findUniqueClass = await prisma.class.findUnique({
            where: {
                code,
            }
        })

        return findUniqueClass
    }


    static findAll = async () => {
        return await prisma.class.findMany({
            include:{
                syllabus:{
                    select:{
                        name:true
                    }
                },
                _count:{
                    select:{
                        subjects:true,
                        users:true,
                        terms:true
                    }
                }
            }
        })
    }


    static getClassesBySyllabusId = async ({syllabusId}: {syllabusId: string}) => {
        return await prisma.class.findMany({
            where:{
                syllabusId
            }
        })
    }

    static findById = async (id: string) => {
        return await prisma.class.findUnique({
            where: { id },
            include: {
                syllabus: {
                    select: {
                        name: true
                    }
                },
                _count: {
                    select: {
                        subjects: true,
                        users: true,
                        terms: true
                    }
                }
            }
        });
    }

    static update = async (id: string, data: any) => {
        return await prisma.class.update({
            where: { id },
            data,
            include: {
                syllabus: {
                    select: {
                        name: true
                    }
                },
                _count: {
                    select: {
                        subjects: true,
                        users: true,
                        terms: true
                    }
                }
            }
        });
    }

    static delete = async (id: string) => {
        return await prisma.class.delete({
            where: { id }
        });
    }
}
