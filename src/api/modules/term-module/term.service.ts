import { validateDto } from "@/core/utils";
import { rethrowAppError } from "@/core/utils/errors/rethrowError";
import { TermValidation } from "./term.validation";
import { TermRepository } from "./term.repository";
import { AppError } from "@/core/utils/errors/AppError";



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

    static async getAllTermService() {
        try {
            return await TermRepository.findAll()
        } catch (error) {
            rethrowAppError(error,'Failed to get all terms')
        }
    }
}

