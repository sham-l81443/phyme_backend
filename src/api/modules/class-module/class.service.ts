import { validateDto } from "../../../core/utils";
import { ClassValidation } from "./class.validation";
import { ClassRepository } from "./class.repository";
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { AppError } from "../../../core/utils/errors/AppError";



export class ClassService {
 
    
    static async createClassService(body:{body:any}) {
     
        try {

        const validateData = validateDto(ClassValidation.createClassSchema,body.body)

        const existingClass = await ClassRepository.findUniqueClassByCode({code:validateData.code})

        if(existingClass){
            throw new AppError({errorType:'Bad Request',message:'Class already exists'})
        }

        const newClass = await ClassRepository.createClass(validateData)

        return newClass
     
    }catch(error){

            rethrowAppError(error,'Failed to create new class')

        }
    }

    static async getAllClassService() {

        try {
            return await ClassRepository.findAll()
        } catch (error) {
            rethrowAppError(error,'Failed to get all classes')
        }

    }


    static async getClassBySyllabusService(body:{body:any}) {
        try {

            const validatedData = validateDto(ClassValidation.getClassBySyllabusSchema,body.body)

            return await ClassRepository.getClassesBySyllabusId({syllabusId:validatedData.syllabusId})
        } catch (error) {
            rethrowAppError(error,'Failed to get classes by syllabus')
        }
    }

    static async updateClassService(id: string, body: any) {
        try {
            // Check if class exists
            const existingClass = await ClassRepository.findById(id);
            if (!existingClass) {
                throw new AppError({ errorType: "Not Found", message: "Class not found" });
            }

            // Validate the update data
            const validatedData = validateDto(ClassValidation.createClassSchema, body);

            // Check if code is being changed and if new code already exists
            if (validatedData.code !== existingClass.code) {
                const codeExists = await ClassRepository.findUniqueClassByCode({ code: validatedData.code });
                if (codeExists) {
                    throw new AppError({ errorType: "Conflict", message: "Class with this code already exists" });
                }
            }

            return await ClassRepository.update(id, validatedData);

        } catch (error) {
            rethrowAppError(error, 'Failed to update class');
        }
    }

    static async deleteClassService(id: string) {
        try {
            // Check if class exists
            const existingClass = await ClassRepository.findById(id);
            if (!existingClass) {
                throw new AppError({ errorType: "Not Found", message: "Class not found" });
            }

            // Check if class has associated subjects, users, or terms
            if (existingClass._count.subjects > 0) {
                throw new AppError({ 
                    errorType: "Conflict", 
                    message: "Cannot delete class with associated subjects" 
                });
            }

            if (existingClass._count.users > 0) {
                throw new AppError({ 
                    errorType: "Conflict", 
                    message: "Cannot delete class with associated users" 
                });
            }

            if (existingClass._count.terms > 0) {
                throw new AppError({ 
                    errorType: "Conflict", 
                    message: "Cannot delete class with associated terms" 
                });
            }

            return await ClassRepository.delete(id);

        } catch (error) {
            rethrowAppError(error, 'Failed to delete class');
        }
    }
}

