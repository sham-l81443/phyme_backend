"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const common_1 = require("@/core/schema/common");
const AppError_1 = require("@/core/utils/errors/AppError");
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const zod_1 = require("zod");
const syllabusSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, {
        message: "Syllabus name must be at least 2 characters.",
    }),
    description: zod_1.z.string().optional(),
    year: zod_1.z.coerce.number().int().positive().optional(),
    language: zod_1.z.string().optional(),
    gradeLevels: zod_1.z.array(zod_1.z.string()).optional(),
    uniqueCode: common_1.SCHEMA.uniqueCode
});
const createSyllabusController = async (req, res, next) => {
    try {
        const validatedData = syllabusSchema.safeParse(req.body);
        if (!validatedData.success) {
            throw new AppError_1.AppError({
                errorType: 'Bad Request',
                message: 'Please provide valid data',
                data: validatedData.error,
            });
        }
        const { name, description, year, language, gradeLevels, uniqueCode } = validatedData.data;
        const syllabus = await prisma_1.default.$transaction(async (tx) => {
            const existingSyllabus = await tx.syllabus.findUnique({
                where: { code: uniqueCode },
            });
            if (existingSyllabus) {
                throw new AppError_1.AppError({
                    errorType: 'Conflict',
                    message: 'Syllabus with this unique code already exists',
                });
            }
            return tx.syllabus.create({
                data: {
                    name,
                    description,
                    year,
                    language,
                    gradeLevels,
                    code: uniqueCode
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    year: true,
                    language: true,
                    gradeLevels: true,
                    code: true,
                },
            });
        });
        const successObj = (0, responseCreator_1.default)({
            data: syllabus,
            code: 201,
            message: "Syllabus created successfully",
        });
        res.status(201).json(successObj);
    }
    catch (e) {
        console.error("Error in createSyllabusController:", e);
        next(e);
    }
};
exports.default = createSyllabusController;
