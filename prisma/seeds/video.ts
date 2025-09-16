export const createVideo = async ({prisma,lessonId,name,code,description,embedLink,duration,thumbnail,isFree,isActive=true}:{prisma: any,lessonId: string,name: string,code: string,description: string,embedLink: string,duration: string,thumbnail: string,isFree: boolean,isActive?: boolean    }) => {
    const video = await prisma.video.upsert({
        where: { code },
        update: {
            name: name,
            lessonId: lessonId,
            description: description,
            embedLink: embedLink,
            duration: duration,
            thumbnail: thumbnail,
            isFree: isFree,
            isActive: isActive,
            updatedAt: new Date(),
        },
        create: {
            name: name,
            code: code,
            lessonId: lessonId,
            description: description,
            embedLink: embedLink,
            duration: duration,
            thumbnail: thumbnail,
            isFree: isFree,
            isActive: isActive,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
      })
      return video
}