import { CODE_SCHEMA, OPTIONAL_STRING_SCHEMA, REQUIRED_STRING_SCHEMA } from '@/core/constants/validationSchema';
import  {z} from 'zod'

export class SyllabusValidation {
    
    
    static createSyllabusSchema = z.object({
          name: REQUIRED_STRING_SCHEMA,
          code: CODE_SCHEMA,
          description: OPTIONAL_STRING_SCHEMA,
          academicYear: z
            .string()
            .regex(/^\d{4}-\d{2}$/, 'Academic year must be in format YYYY-YY (e.g., 2024-25)')
            .optional()
            .nullable(),
          isActive: z.boolean().optional().default(true)
        })


     static updateSyllabusSchema = z.object({
        params: z.object({
          id: z.string().cuid('Invalid syllabus ID format')
        }),
        body: z.object({
          name: z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name must not exceed 100 characters')
            .trim()
            .optional(),
          code: CODE_SCHEMA,
          description: OPTIONAL_STRING_SCHEMA,
          academicYear: z
            .string()
            .regex(/^\d{4}-\d{2}$/, 'Academic year must be in format YYYY-YY (e.g., 2024-25)')
            .optional()
            .nullable(),
          isActive: z.boolean().optional()
        }).refine(data => Object.keys(data).length > 0, {
          message: 'At least one field must be provided for update'
        })
      });

      static getSyllabusSchema = z.object({
        params: z.object({
          id: z.string().cuid('Invalid syllabus ID format')
        })
      });
      
      static deleteSyllabusSchema = z.object({
        params: z.object({
          id: z.string().cuid('Invalid syllabus ID format')
        })
      });

      static getSyllabiQuerySchema = z.object({
        query: z.object({
          page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
          limit: z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
          search: z.string().trim().optional(),
          isActive: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
          academicYear: z.string().optional(),
          sortBy: z.enum(['name', 'code', 'createdAt', 'updatedAt']).optional().default('createdAt'),
          sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
        })
      });
}