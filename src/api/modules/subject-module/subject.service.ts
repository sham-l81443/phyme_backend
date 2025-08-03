import { validateDto } from "../../../core/utils/dto/validateData";
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
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
            return await SubjectRepository.findAll({})
        } catch (error) {
            rethrowAppError(error,'Failed to get all subjects')
        }
    }


    static async getSubjectsByClassIdService (user:any){
        try {

            console.log(user)

            const validateData = validateDto(SubjectValidation.getSubjectsByClassIdSchema,{classId:user?.classId})

            const subjects = await SubjectRepository.findAll({classId:validateData.classId})

            return subjects

        } catch (error) {

            rethrowAppError(error,'Failed to get subjects by class')
        }
    }

}

