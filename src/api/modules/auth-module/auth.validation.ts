import { EMAIL_SCHEMA, OTP_SCHEMA, PASSWORD_SCHEMA, REQUIRED_NUMBER_SCHEMA, REQUIRED_STRING_SCHEMA } from "@/core/constants/validationSchema";
import { z } from "zod";


export class AuthValidation {
    
    static loginSchema = z.object({
        email: EMAIL_SCHEMA,
        password: REQUIRED_STRING_SCHEMA,
    })

    static registerSchema = z.object({
        name: REQUIRED_STRING_SCHEMA,
        email: EMAIL_SCHEMA,
        syllabusId: REQUIRED_STRING_SCHEMA,
        classId: REQUIRED_STRING_SCHEMA,
    })

    static verifyEmailOtpPasswordSchema = z.object({
        email: EMAIL_SCHEMA,
        otp: OTP_SCHEMA,
        password: PASSWORD_SCHEMA,
    })

    static verifyEmailSchema = z.object({
        email: EMAIL_SCHEMA
    })

}


