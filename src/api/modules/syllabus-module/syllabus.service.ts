import { rethrowAppError } from "@/core/utils/errors/rethrowError";
import { SyllabusValidation } from "./syllabus.validation";
import { AppError } from "@/core/utils/errors/AppError";
import { validateDto } from "@/core/utils";
import { SyllabusRepository } from "./syllabus.repository";



export class SyllabusService   {
    

    static async createSyllabusService(body:{body:any}) {

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

}

