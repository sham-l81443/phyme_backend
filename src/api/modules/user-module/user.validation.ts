import { EMAIL_SCHEMA, REQUIRED_STRING_SCHEMA } from "@/core/constants/validationSchema";
import { z } from "zod";


export class UserValidation {
   
    static validateEmailSchema = z.object({
        email:EMAIL_SCHEMA
    })

    static validateIdSchema = z.object({
        id:REQUIRED_STRING_SCHEMA
    })

    static validateUpdateUserSchema = z.object({
        id:REQUIRED_STRING_SCHEMA,
        data:z.object({
            name:REQUIRED_STRING_SCHEMA,
            email:EMAIL_SCHEMA,
        })
    })
}


