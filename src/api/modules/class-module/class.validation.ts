import { CODE_SCHEMA, OPTIONAL_STRING_SCHEMA, REQUIRED_STRING_SCHEMA } from "../../../core/constants/validationSchema";
import { z } from "zod";

export class ClassValidation {
    
    static createClassSchema = z.object({
        name:REQUIRED_STRING_SCHEMA,
        description:OPTIONAL_STRING_SCHEMA,
        code:CODE_SCHEMA,
        syllabusId:REQUIRED_STRING_SCHEMA
    })

    static getClassBySyllabusSchema = z.object({
        syllabusId:REQUIRED_STRING_SCHEMA
    })

}