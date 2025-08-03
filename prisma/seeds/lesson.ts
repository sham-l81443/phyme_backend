

export const createLesson = async ({ prisma, lessonData }: { prisma: any, lessonData: any }) => {
    const newLesson = await prisma.lesson.create({
        data: {
            name: lessonData.name,
            code: lessonData.code,
            chapterId: lessonData.chapterId,
            description: lessonData.description,
            isActive: true,
        }
    })
    return newLesson
}
