const createSyllabus = async ({prisma,code,name,description,isActive=true}:{prisma: any,code: string,name: string,description: string,isActive?: boolean    }) => {
 
    const newSyllabus = await prisma.syllabus.create({
            data: {
            code: code,
            name: name,
            description: description,
            isActive: isActive,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
    
    return newSyllabus;
}
            
export {createSyllabus}
