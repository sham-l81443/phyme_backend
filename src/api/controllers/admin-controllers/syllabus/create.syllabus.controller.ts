import prisma from "@/core/lib/prisma";
import { SCHEMA } from "@/core/schema/common";
import { IController } from "@/core/types";
import { AppError } from "@/core/utils/errors/AppError";
import createSuccessResponse from "@/core/utils/responseCreator";
import { z } from "zod";


const syllabusSchema = z.object({
    name: z.string().min(2, {
        message: "Syllabus name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    year: z.coerce.number().int().positive().optional(),
    language: z.string().optional(),
    gradeLevels: z.array(z.string()).optional(),
    uniqueCode: SCHEMA.uniqueCode
});




const createSyllabusController: IController = async (req, res, next) => {
    try {

        const validatedData = syllabusSchema.safeParse(req.body);
        if (!validatedData.success) {
            throw new AppError({
                errorType: 'Bad Request',
                message: 'Please provide valid data',
                data: validatedData.error,
            });
        }

        const { name, description, year, language, gradeLevels, uniqueCode } = validatedData.data;

        // Create syllabus within a transaction
        const syllabus = await prisma.$transaction(async (tx) => {
            // Check for duplicate syllabus code
            const existingSyllabus = await tx.syllabus.findUnique({
                where: { code: uniqueCode },
            });
            if (existingSyllabus) {
                throw new AppError({
                    errorType: 'Conflict',
                    message: 'Syllabus with this unique code already exists',
                });
            }

            // Create syllabus
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

        // Send success response
        const successObj = createSuccessResponse({
            data: syllabus,
            code: 201,
            message: "Syllabus created successfully",
        });

        res.status(201).json(successObj);
    } catch (e) {
        console.error("Error in createSyllabusController:", e);
        next(e);
    }
};

export default createSyllabusController;

