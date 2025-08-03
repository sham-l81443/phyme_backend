
const createClass = async ({prisma,syllabusId,name,code,description,isActive=true}:{prisma: any,syllabusId: string,name: string,code: string,description: string,isActive?: boolean    }) => {
 
    const newClass = await prisma.class.create({
        data: {
            name: name,
            code: code,
            description: description,
            isActive: isActive,
            syllabusId: syllabusId,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    return newClass;
};

export {createClass};