export const createSubject = async ({prisma,name,code,description,isActive=true,classId}:{prisma: any,name: string,code: string,description: string,isActive?: boolean, classId: string   }) => {
    const subject = await prisma.subject.upsert({ 
        where: { code },
        update: {
            name: name,
            isActive: isActive,
            classId: classId,
            description: description,
            updatedAt: new Date(),
        },
        create: {
            name: name,
            code: code,
            isActive: isActive,
            classId: classId,
            description: description,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
      })

      return  subject
    }
    