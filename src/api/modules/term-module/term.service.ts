import { validateDto } from "../../../core/utils";
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { TermValidation } from "./term.validation";
import { TermRepository } from "./term.repository";
import { AppError } from "../../../core/utils/errors/AppError";



export class TermService {
 
    static async createTermService(body:any) {
        try {
            
            const validateData = validateDto(TermValidation.createTermSchema,body)

            const existingTerm = await TermRepository.findUniqueTermByCode({code:validateData.code})

            if(existingTerm){
                throw new AppError({errorType:'Bad Request',message:'Term already exists'})
            }

            const newTerm = await TermRepository.createTerm(validateData)

            return newTerm

        }catch(error){
     
            rethrowAppError(error,'Failed to create new term')
            
        }
    }

    static async getAllTermServiceByClassId(classId?:string, studentId?: string) {
        try {
            return await TermRepository.getTermByStudentClassId(classId as string, studentId)
        } catch (error) {
            rethrowAppError(error,'Failed to get all terms')
        }
    }


    static async getAllTermService() {
        try {
            return await TermRepository.getAllTermService()
        } catch (error) {
            rethrowAppError(error,'Failed to get all terms')
        }
    }

    static async updateTermService(id: string, body: any) {
        try {
            // Check if term exists
            const existingTerm = await TermRepository.findById(id);
            if (!existingTerm) {
                throw new AppError({ errorType: "Not Found", message: "Term not found" });
            }

            // Validate the update data
            const validatedData = validateDto(TermValidation.createTermSchema, body);

            // Check if code is being changed and if new code already exists
            if (validatedData.code !== existingTerm.code) {
                const codeExists = await TermRepository.findUniqueTermByCode({ code: validatedData.code });
                if (codeExists) {
                    throw new AppError({ errorType: "Conflict", message: "Term with this code already exists" });
                }
            }

            return await TermRepository.update(id, validatedData);

        } catch (error) {
            rethrowAppError(error, 'Failed to update term');
        }
    }

    static async deleteTermService(id: string) {
        try {
            // Check if term exists
            const existingTerm = await TermRepository.findById(id);
            if (!existingTerm) {
                throw new AppError({ errorType: "Not Found", message: "Term not found" });
            }

            // Check if term has associated chapters or subscriptions
            if (existingTerm._count.chapters > 0) {
                throw new AppError({ 
                    errorType: "Conflict", 
                    message: "Cannot delete term with associated chapters" 
                });
            }

            if (existingTerm._count.studentSubscription > 0) {
                throw new AppError({ 
                    errorType: "Conflict", 
                    message: "Cannot delete term with active student subscriptions" 
                });
            }

            return await TermRepository.delete(id);

        } catch (error) {
            rethrowAppError(error, 'Failed to delete term');
        }
    }

}

