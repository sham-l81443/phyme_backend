const createChapter = async ({prisma,subjectId,termId,name,code,description,isActive=true}:{prisma: any,subjectId: string,termId: string,name: string,code: string,description: string,isActive?: boolean    }) => {
    const chapter = await prisma.chapter.upsert({ 
        where: { code },
        update: {
            name: name,
            subjectId: subjectId,
            termId: termId,
            isActive: isActive,
            description: description,
            updatedAt: new Date(),
        },
        create: {
            name: name,
            code: code,
            subjectId: subjectId,
            termId: termId,
            isActive: isActive,
            description: description,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
      })
      return  chapter
}

export { createChapter };