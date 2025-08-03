"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyllabusValidation = void 0;
const validationSchema_1 = require("../../../core/constants/validationSchema");
const zod_1 = require("zod");
class SyllabusValidation {
}
exports.SyllabusValidation = SyllabusValidation;
SyllabusValidation.createSyllabusSchema = zod_1.z.object({
    name: validationSchema_1.REQUIRED_STRING_SCHEMA,
    code: validationSchema_1.CODE_SCHEMA,
    description: validationSchema_1.OPTIONAL_STRING_SCHEMA,
    academicYear: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}$/, 'Academic year must be in format YYYY-YY (e.g., 2024-25)')
        .optional()
        .nullable(),
    isActive: zod_1.z.boolean().optional().default(true)
});
SyllabusValidation.updateSyllabusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().cuid('Invalid syllabus ID format')
    }),
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name must not exceed 100 characters')
            .trim()
            .optional(),
        code: validationSchema_1.CODE_SCHEMA,
        description: validationSchema_1.OPTIONAL_STRING_SCHEMA,
        academicYear: zod_1.z
            .string()
            .regex(/^\d{4}-\d{2}$/, 'Academic year must be in format YYYY-YY (e.g., 2024-25)')
            .optional()
            .nullable(),
        isActive: zod_1.z.boolean().optional()
    }).refine(data => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update'
    })
});
SyllabusValidation.getSyllabusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().cuid('Invalid syllabus ID format')
    })
});
SyllabusValidation.deleteSyllabusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().cuid('Invalid syllabus ID format')
    })
});
SyllabusValidation.getSyllabiQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default('10'),
        search: zod_1.z.string().trim().optional(),
        isActive: zod_1.z.enum(['true', 'false']).transform(val => val === 'true').optional(),
        academicYear: zod_1.z.string().optional(),
        sortBy: zod_1.z.enum(['name', 'code', 'createdAt', 'updatedAt']).optional().default('createdAt'),
        sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc')
    })
});
