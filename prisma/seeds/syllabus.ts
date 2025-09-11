const createSyllabus = async ({prisma,code,name,description,isActive=true}:{prisma: any,code: string,name: string,description: string,isActive?: boolean    }) => {
 
    // Check if syllabus already exists
    const existingSyllabus = await prisma.syllabus.findUnique({
        where: { code: code }
    });
    
    if (existingSyllabus) {
        console.log(`Syllabus with code ${code} already exists, using existing syllabus`);
        return existingSyllabus;
    }
    
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
