export const ceateStudentSubscription = async ({ prisma,studentId,termId }: { prisma: any,studentId:string,termId:string }) => {
    const studentSubscription = await prisma.studentSubscription.create({
        data: {
            studentId: studentId,
            termId: termId,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    })
    return studentSubscription
}