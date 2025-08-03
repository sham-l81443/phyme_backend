"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const class_schema_1 = require("@/core/schema/class.schema");
const AppError_1 = require("@/core/utils/errors/AppError");
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const createClassController = async (req, res, next) => {
    try {
        const validatedData = class_schema_1.classSchema.safeParse(req.body);
        if (!validatedData.success) {
            throw new AppError_1.AppError({
                errorType: 'Bad Request',
                message: 'Please provide valid data',
                data: validatedData.error,
            });
        }
        const { name, description, code, syllabusId } = validatedData.data;
        const syllabusIdInt = parseInt(syllabusId);
        const newClass = await prisma_1.default.$transaction(async (tx) => {
            const isClassExist = await tx.class.findUnique({
                where: { code },
            });
            if (isClassExist) {
                throw new AppError_1.AppError({
                    errorType: 'Conflict',
                    message: 'Class with this unique code already exists',
                });
            }
            const syllabus = await tx.syllabus.findUnique({
                where: { id: syllabusIdInt },
            });
            if (!syllabus) {
                throw new AppError_1.AppError({
                    data: syllabus,
                    errorType: 'Bad Request',
                    message: 'Syllabus with the provided ID does not exist',
                });
            }
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
        const successObj = (0, responseCreator_1.default)({
            data: newClass,
            code: 201,
            message: "Class created successfully",
        });
        res.status(201).json(successObj);
    }
    catch (e) {
        console.error("Error in createClassController:", e);
        next(e);
    }
};
exports.default = createClassController;
