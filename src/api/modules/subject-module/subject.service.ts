import { validateDto } from "@/core/utils/dto/validateData";
import { rethrowAppError } from "@/core/utils/errors/rethrowError";
import { SubjectValidation } from "./subject.validation";
import { SubjectRepository } from "./subject.repository";


export class SubjectService {
    

    static async createSubjectService(body:any) {
     
        try {

            const validateData = validateDto(SubjectValidation.createSubjectSchema,body)

            const subject = await SubjectRepository.createSubject(validateData)

            return subject
            
        }catch(error){
         
            rethrowAppError(error,'Failed to create new subject')
            
        }
        
    }


    static async getAllSubjectService() {
        try {
            return await SubjectRepository.findAll()
        } catch (error) {
            rethrowAppError(error,'Failed to get all subjects')
        }
    }

}

