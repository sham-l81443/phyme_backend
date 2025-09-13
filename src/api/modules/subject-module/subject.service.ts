import { validateDto } from "../../../core/utils/dto/validateData";
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { AppError } from "../../../core/utils/errors/AppError";
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

    static async updateSubjectService(id: string, body: any) {
        try {
            // Check if subject exists
            const existingSubject = await SubjectRepository.findById(id);
            if (!existingSubject) {
                throw new AppError({ errorType: "Not Found", message: "Subject not found" });
            }

            // Validate the update data
            const validatedData = validateDto(SubjectValidation.createSubjectSchema, body);

            return await SubjectRepository.update(id, validatedData);

        } catch (error) {
            rethrowAppError(error, 'Failed to update subject');
        }
    }

    static async deleteSubjectService(id: string) {
        try {
            // Check if subject exists
            const existingSubject = await SubjectRepository.findById(id);
            if (!existingSubject) {
                throw new AppError({ errorType: "Not Found", message: "Subject not found" });
            }

            // Check if subject has associated chapters
            if (existingSubject._count?.chapters > 0) {
                throw new AppError({ 
                    errorType: "Conflict", 
                    message: "Cannot delete subject with associated chapters" 
                });
            }

            return await SubjectRepository.delete(id);

        } catch (error) {
            rethrowAppError(error, 'Failed to delete subject');
        }
    }

}

