import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { SyllabusValidation } from "./syllabus.validation";
import { AppError } from "../../../core/utils/errors/AppError";
import { validateDto } from "../../../core/utils";
import { SyllabusRepository } from "./syllabus.repository";



export class SyllabusService   {
    

    static async createSyllabusService(body:{body:any}) {
        
console.log(body)
        try {

           const validatedData = validateDto(SyllabusValidation.createSyllabusSchema,body)

        // const validatedData = SyllabusValidation.createSyllabusSchema.safeParse(body)

        // if(!validatedData.success){
        //     throw new AppError({errorType:"Bad Request",message:"Invalid request body",data:validatedData.error})
        // }
           console.log(validatedData)

           const existingSyllabus = await SyllabusRepository.findByCode(validatedData.code);

           if (existingSyllabus) {
             throw new AppError({errorType:"Conflict",message:"Syllabus with this code already exists"});
           }
           
           return await SyllabusRepository.create(validatedData)
           

        } catch (error) {

            rethrowAppError(error,'Failed to create new syllabus')

        }

    }


    static async getAllSyllabusService() {

        try {
            return await SyllabusRepository.findAll()
        } catch (error) {
            rethrowAppError(error,'Failed to get all syllabus')
        }

    }

    static async updateSyllabusService(id: string, body: any) {
        try {
            // Check if syllabus exists
            const existingSyllabus = await SyllabusRepository.findById(id);
            if (!existingSyllabus) {
                throw new AppError({ errorType: "Not Found", message: "Syllabus not found" });
            }

            // Validate the update data
            const validatedData = validateDto(SyllabusValidation.createSyllabusSchema, body);

            // Check if code is being changed and if new code already exists
            if (validatedData.code !== existingSyllabus.code) {
                const codeExists = await SyllabusRepository.findByCode(validatedData.code, id);
                if (codeExists) {
                    throw new AppError({ errorType: "Conflict", message: "Syllabus with this code already exists" });
                }
            }

            return await SyllabusRepository.update(id, validatedData);

        } catch (error) {
            rethrowAppError(error, 'Failed to update syllabus');
        }
    }

    static async deleteSyllabusService(id: string) {
        try {
            // Check if syllabus exists
            const existingSyllabus = await SyllabusRepository.findById(id);
            if (!existingSyllabus) {
                throw new AppError({ errorType: "Not Found", message: "Syllabus not found" });
            }

            // Check if syllabus has associated classes or users
            if (existingSyllabus._count.classes > 0) {
                throw new AppError({ 
                    errorType: "Conflict", 
                    message: "Cannot delete syllabus with associated classes" 
                });
            }

            if (existingSyllabus._count.users > 0) {
                throw new AppError({ 
                    errorType: "Conflict", 
                    message: "Cannot delete syllabus with associated users" 
                });
            }

            return await SyllabusRepository.delete(id);

        } catch (error) {
            rethrowAppError(error, 'Failed to delete syllabus');
        }
    }

}

