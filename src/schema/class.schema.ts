import { z } from "zod";
import { SCHEMA } from "./common";

export const classSchema = z.object({
    name: SCHEMA.name,
    code: SCHEMA.uniqueCode,
    syllabusId: SCHEMA.required,
    description: SCHEMA.description

})




export type ICreateClass = z.infer<typeof classSchema>