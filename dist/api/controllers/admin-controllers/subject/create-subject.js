"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("@/core/lib/prisma"));
const subjectSchema_1 = require("@/core/schema/subjectSchema");
const AppError_1 = require("@/core/utils/errors/AppError");
const responseCreator_1 = __importDefault(require("@/core/utils/responseCreator"));
const createSubjectController = async (req, res, next) => {
    var _a, _b, _c, _d;
    try {
        const validatedData = await subjectSchema_1.SubjectSchema.create.safeParseAsync(req.body);
        if (!validatedData.success) {
            throw new AppError_1.AppError({ errorType: 'Bad Request', message: validatedData.error.message });
        }
        const subject = await prisma_1.default.subject.create({
            data: {
                name: (_a = validatedData === null || validatedData === void 0 ? void 0 : validatedData.data) === null || _a === void 0 ? void 0 : _a.name,
                classId: parseInt((_b = validatedData === null || validatedData === void 0 ? void 0 : validatedData.data) === null || _b === void 0 ? void 0 : _b.classId),
                teacherName: (_c = validatedData === null || validatedData === void 0 ? void 0 : validatedData.data) === null || _c === void 0 ? void 0 : _c.teacherName,
                code: (_d = validatedData === null || validatedData === void 0 ? void 0 : validatedData.data) === null || _d === void 0 ? void 0 : _d.code
            },
            select: {
                name: true,
                createdAt: true,
                id: true,
                updatedAt: true,
                code: true,
                teacherName: true
            }
        });
        const resObj = (0, responseCreator_1.default)({
            message: "Subject created successfully",
            data: subject
        });
        res.status(201).json(resObj);
        return;
    }
    catch (e) {
        next(e);
    }
};
exports.default = createSubjectController;
