const createChapter = async ({prisma,subjectId,termId,name,code,description,isActive=true}:{prisma: any,subjectId: string,termId: string,name: string,code: string,description: string,isActive?: boolean    }) => {
    const chapter = await prisma.chapter.create({ 
        data:{
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