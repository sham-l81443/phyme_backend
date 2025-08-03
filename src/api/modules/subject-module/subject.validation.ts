
import { CODE_SCHEMA, OPTIONAL_STRING_SCHEMA, REQUIRED_STRING_SCHEMA } from "@/core/constants/validationSchema";
import { z } from "zod";

export class SubjectValidation {

    static createSubjectSchema = z.object({
        name: REQUIRED_STRING_SCHEMA,
        code: CODE_SCHEMA,
        classId: REQUIRED_STRING_SCHEMA,
        description: OPTIONAL_STRING_SCHEMA,
    })
    

    static getSubjectsByClassIdSchema = z.object({
        classId: REQUIRED_STRING_SCHEMA,
    })
}   
    
