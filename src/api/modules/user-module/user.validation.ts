import { EMAIL_SCHEMA, PASSWORD_SCHEMA, REQUIRED_STRING_SCHEMA } from "../../../core/constants/validationSchema";
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

    static validateVerifyUserSchema = z.object({
        userId: REQUIRED_STRING_SCHEMA
    })

    static validateAddPasswordSchema = z.object({
        userId: REQUIRED_STRING_SCHEMA,
        password: PASSWORD_SCHEMA
    })

    static validateGetUnverifiedUsersSchema = z.object({
        page: z.string().optional().transform(val => val ? parseInt(val) : 1),
        limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
    })
}


