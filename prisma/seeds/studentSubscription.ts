export const ceateStudentSubscription = async ({ prisma,studentId,termId }: { prisma: any,studentId:string,termId:string }) => {
    const studentSubscription = await prisma.studentSubscription.upsert({
        where: { 
            studentId_termId: {
                studentId: studentId,
                termId: termId
            }
        },
        update: {
            isActive: true,
            updatedAt: new Date(),
        },
        create: {
            studentId: studentId,
            termId: termId,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    })
    return studentSubscription
}