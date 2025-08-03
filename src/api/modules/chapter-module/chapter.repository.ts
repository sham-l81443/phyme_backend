import prisma from "@/core/lib/prisma";

export class ChapterRepository {

    static createChapter = async ({ name, code, termId, subjectId, description }: { name: string, code: string, termId: string, subjectId: string, description?: string }) => {
        const newChapter = await prisma.chapter.create({
            data: {
                name,
                code,
                termId,
                description,
                subjectId,
                isActive: true
            }
        })
        return newChapter
    }

    static findAll = async () => {
        const findAllChapters = await prisma.chapter.findMany({
            include: {
                subject: true,
                term: true
            }
        })
        return findAllChapters
    }


    static findChapterBySubjectIdAndTermId = async ({ subjectId, termId }: { subjectId: string, termId: string[] }) => {
        const findChapterBySubjectId = await prisma.chapter.findMany({
            where: {
                subjectId,
                termId: {
                    in: termId,
                },
                isActive: true
            },
            include: {
                _count: true
            },
            orderBy: {
                name: 'asc'
            }
        })
        return findChapterBySubjectId
    }
}
