
import prisma from "@/core/lib/prisma";
import { classSchema } from "@/core/schema/class.schema";
import { IController } from "@/core/types";
import { AppError } from "@/core/utils/errors/AppError";
import createSuccessResponse from "@/core/utils/responseCreator";

const createClassController: IController = async (req, res, next) => {
    try {


        // if (!req.user) {
        //     throw new AppError({

        //         errorType: 'Unauthorized',
        //         message: 'User not authenticated',
        //     });
        // }

        // Validate input
        const validatedData = classSchema.safeParse(req.body);
        if (!validatedData.success) {
            throw new AppError({
                errorType: 'Bad Request',
                message: 'Please provide valid data',
                data: validatedData.error,
            });
        }

        const { name, description, code, syllabusId } = validatedData.data;

        const syllabusIdInt = parseInt(syllabusId);

        // Create class within a transaction
        const newClass = await prisma.$transaction(async (tx) => {
            // Check for duplicate class code
            const isClassExist = await tx.class.findUnique({
                where: { code },
            });
            if (isClassExist) {
                throw new AppError({
                    errorType: 'Conflict',
                    message: 'Class with this unique code already exists',
                });
            }

            // Verify syllabus exists
            const syllabus = await tx.syllabus.findUnique({
                where: { id: syllabusIdInt },
            });
            if (!syllabus) {
                throw new AppError({
                    data: syllabus,
                    errorType: 'Bad Request',
                    message: 'Syllabus with the provided ID does not exist',
                });
            }

            // Create class
            return tx.class.create({
                data: {
                    name,
                    description,
                    code,
                    syllabusId: syllabusIdInt,
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    code: true,
                    syllabusId: true,
                },
            });
        });

        // Send success response
        const successObj = createSuccessResponse({
            data: newClass,
            code: 201,
            message: "Class created successfully",
        });

        res.status(201).json(successObj);
    } catch (e) {
        console.error("Error in createClassController:", e);
        next(e);
    }
};

export default createClassController;