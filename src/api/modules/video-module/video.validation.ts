
import { OPTIONAL_STRING_SCHEMA, REQUIRED_STRING_SCHEMA } from "../../../core/constants/validationSchema";
import { z } from "zod";

export class VideoValidation {


    static createVideo = z.object({
        name: REQUIRED_STRING_SCHEMA,
        description: OPTIONAL_STRING_SCHEMA,
        embedLink: REQUIRED_STRING_SCHEMA,
        duration: OPTIONAL_STRING_SCHEMA,
        code: REQUIRED_STRING_SCHEMA,
        thumbnail: OPTIONAL_STRING_SCHEMA,
        lessonId: REQUIRED_STRING_SCHEMA,
    })
    
}