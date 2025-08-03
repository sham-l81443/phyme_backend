import { validateDto } from "@/core/utils";
import { ClassValidation } from "./class.validation";
import { ClassRepository } from "./class.repository";
import { rethrowAppError } from "@/core/utils/errors/rethrowError";
import { AppError } from "@/core/utils/errors/AppError";



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
}

