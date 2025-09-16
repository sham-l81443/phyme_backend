


export const createTerm = async ({prisma,name,code,description,classId,isActive=true}:{prisma: any,name: string,code: string,description: string,classId: string,isActive?: boolean    }) => {
    const term = await prisma.term.upsert({ 
        where: { code },
        update: {
            name: name,
            isActive: isActive,
            description: description,
            classId: classId,
            updatedAt: new Date(),
        },
        create: {
            name: name,
            code: code,
            isActive: isActive,
            description: description,
            classId: classId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
      });
      return term;
    }

    