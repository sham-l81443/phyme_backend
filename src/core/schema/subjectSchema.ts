import { z } from "zod";
import { SCHEMA } from "./common";

export const SubjectSchema = {
    create: z.object({
      name: SCHEMA.name,
      classId: z.string().min(1,{message:"Class ID is required"}),
      teacherName: z.string().min(2).max(50).optional(),
      code: SCHEMA.uniqueCode
    }),
  
    update: z.object({
      name: SCHEMA.name.optional(),
      classId: z.number().int().positive({ message: "Class ID must be a positive number" }).optional(),
      teacherName: z.string().min(2).max(50).optional(),
      code: SCHEMA.uniqueCode.optional()
    })
  };
  
  export type CreateSubjectDto = z.infer<typeof SubjectSchema.create>;
  export type UpdateSubjectDto = z.infer<typeof SubjectSchema.update>;