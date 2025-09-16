

export const createLesson = async ({ prisma, lessonData }: { prisma: any, lessonData: any }) => {
    const newLesson = await prisma.lesson.upsert({
        where: { code: lessonData.code },
        update: {
            name: lessonData.name,
            chapterId: lessonData.chapterId,
            description: lessonData.description,
            isActive: true,
            updatedAt: new Date(),
        },
        create: {
            name: lessonData.name,
            code: lessonData.code,
            chapterId: lessonData.chapterId,
            description: lessonData.description,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    })
    return newLesson
}
