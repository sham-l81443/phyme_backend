const createAdmin = async (prisma: any) => {
    
    const newAdmin = await prisma.user.create({
        data: {
            name: 'Admin',
            email: 'shamz81443@gmail.com',
            phone: '6238830867',
            password: '$2b$10$oYSh2e9QictHB2FaeDJ7tO7xkO.ZBcK63iDKru8UV43wZ4tcBDyJu',
            role: 'ADMIN',
            isTermsAccepted: true,
            isVerified: true,
            registrationType: 'DEFAULT',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    });
    
    return newAdmin;
}




const createStudent = async ({prisma,name,email,phone,syllabusId,classId,isTermsAccepted=true,isVerified=true,registrationType="DEFAULT",createdAt=new Date(),updatedAt=new Date()}:any) => {
    
    const newStudent = await prisma.user.create({
        data: {
            name: name,
            email: email,
            phone: phone,
            syllabusId: syllabusId,
            classId: classId,
            password: '$2b$10$oYSh2e9QictHB2FaeDJ7tO7xkO.ZBcK63iDKru8UV43wZ4tcBDyJu',
            role: 'STUDENT',
            isTermsAccepted: isTermsAccepted,
            isVerified: isVerified,
            registrationType: registrationType,
            createdAt: createdAt,
            updatedAt: updatedAt,
        }
    });
    
    return newStudent;
}

export {createStudent,createAdmin}