import { CODE_SCHEMA, OPTIONAL_STRING_SCHEMA, REQUIRED_STRING_SCHEMA } from "@/core/constants/validationSchema";
import { z } from "zod";

export class ChapterValidation {
    

    static createChapterSchema = z.object({
        name: REQUIRED_STRING_SCHEMA,
        code:CODE_SCHEMA,
        termId:REQUIRED_STRING_SCHEMA,
        subjectId:REQUIRED_STRING_SCHEMA,
        description:OPTIONAL_STRING_SCHEMA,
    })


    static findByTermIdAndSubjectIdSchema = z.object({
        subjectId:REQUIRED_STRING_SCHEMA,
        termId:z.array(REQUIRED_STRING_SCHEMA),
    })
}