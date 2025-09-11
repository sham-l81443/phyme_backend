
const createClass = async ({prisma,syllabusId,name,code,description,isActive=true}:{prisma: any,syllabusId: string,name: string,code: string,description: string,isActive?: boolean    }) => {
 
    // Check if class already exists
    const existingClass = await prisma.class.findUnique({
        where: { code: code }
    });
    
    if (existingClass) {
        console.log(`Class with code ${code} already exists, using existing class`);
        return existingClass;
    }
    
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